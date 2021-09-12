import * as solwr from 'solwr'
import * as redis from 'redis'

import { promisify } from 'util'

import config from '../config'

solwr.address({
  host: `${config.solr.protocol}://${config.solr.host}`,
  port: config.solr.port
})

const client = redis.createClient(`redis://${config.redis.host}:${config.redis.port}`)

const users = solwr.core(config.solr.core)

interface Query {
  username: string[]
  title: string
  desc: string
  type: ['bot' | 'supergroup' | 'channel']
  members: number[]
  verify: boolean[]
  length: number
}

export default class Search {
  /**
   * 查询信息
   *
   * @param keyword - 关键词
   * @param skip    - 跳过多少个信息
   * @returns 返回查询信息
   */
  async find (keyword: string, skip: number): Promise<Query[]> {
    return await users
      .find(`title:"${encodeURI(keyword)}" OR desc:"${encodeURI(keyword)}"`)
      .only()
      .limit(11)
      .skip(skip)
      .exec()
  }

  /**
   * @param username - 用户名
   * @param title    - 标题
   * @param desc     - 简介
   * @param type     - 类型, 分三种: 机器人, 公开群组, 公开频道
   * @param members  - 人数, 机器人人数为 0
   */
  async add (username: string, title: string, desc: string, type: 'bot' | 'supergroup' | 'channel' | 'NSFWchannel', members: number, verify?: boolean): Promise<void> {
    await users.create({
      username,
      title,
      desc,
      type,
      members,
      verify
    }).exec()

    const obj: Query = await users
      .find(`username:${username}`)
      .only()
      .exec()

    let id: string

    for (let i = 0; i < obj.length; i++) {
      if (obj[i].username[0] === username) {
        id = obj[i].id
      }
    }

    const HMSET = promisify(client.hmset).bind(client)
    await HMSET('xiaoxiaojingAddList', username, id)
  }

  /**
   * 删除
   *
   * @param username - Username
   */
  async remove (username: string): Promise<void> {
    const id: string = await this.check(username)
    await users.remove(`id:${id}`).exec()

    const HDEL = promisify(client.HDEL).bind(client)
    await HDEL('xiaoxiaojingAddList', username)
  }

  /**
   * 更新信息
   *
   * 参数与 add 方法相同
   */
  async update (username: string, title: string, desc: string, type: 'bot' | 'supergroup' | 'channel', members: number, verify?: boolean): Promise<void> {
    this.remove(username)

    this.add(
      username,
      title,
      desc,
      type,
      members,
      verify
    )
  }

  /**
   * 检查是否已提交
   *
   * @param username - Username
   * @returns 如果存在返回在 Solr 中的 ID，如果不存在返回空字符串
   */
  async check (username: string): Promise<string> {
    const HGET = promisify(client.hmget).bind(client)
    const data: [string | null] = await HGET('xiaoxiaojingAddList', username)

    if (data[0] === null) {
      return ''
    } else {
      return data[0]
    }
  }

  /**
   * 加入黑名单
   *
   * @param username - Username
   * @param time     - 到什么时候可以移出黑名单
   */
  async addBlockList (username: string, time: number): Promise<void> {
    const HMSET = promisify(client.hmset).bind(client)
    await HMSET('xiaoxiaojingBlockList', username, time)
  }

  async checkBlockList (username: string): Promise<boolean> {
    const HGET = promisify(client.hmget).bind(client)
    const result: [number | null] = await HGET('xiaoxiaojingBlockList', username)

    if (result[0] === null) {
      return false
    } else if (result[0] < Math.round(new Date().getTime() / 1000)) {
      const HDEL = promisify(client.hdel).bind(client)
      await HDEL('xiaoxiaojingBlockList', username)
      return false
    } else {
      return true
    }
  }

  async addAuditing (username: string): Promise<void> {
    const SADD = promisify(client.sadd).bind(client)
    await SADD('xiaoxiaojingAuditingList', username)
  }

  async removeAuditing (username: string): Promise<void> {
    const SREM = promisify(client.srem).bind(client)
    await SREM('xiaoxiaojingAuditingList', username)
  }

  async checkAuditing (username: string): Promise<boolean> {
    const SISMEMBER = promisify(client.sismember).bind(client)
    const result = await SISMEMBER('xiaoxiaojingAuditingList', username)

    if (result === 1) {
      return true
    } else {
      return false
    }
  }

  private async addUpdateList (username: string, time: number): Promise<void> {
    const HMSET = promisify(client.hmset).bind(client)
    await HMSET('xiaoxiaojingUpdateList', username, time)
  }

  /**
   * 检测是否能更新
   *
   * @param username - Username
   * @returns 返回是否能更新
   */
  async checkUpdateList (username: string): Promise<boolean> {
    const HGET = promisify(client.hmget).bind(client)
    const result: [string | null] = await HGET('xiaoxiaojingUpdateList', username)

    if (result[0] === null) {
      this.addUpdateList(username, Math.round(new Date().getTime() / 1000) + 1800)

      return true
    } else if (+result[0] < Math.round(new Date().getTime() / 1000)) {
      const HDEL = promisify(client.hdel).bind(client)
      await HDEL('xiaoxiaojingUpdateList', username)

      this.addUpdateList(username, Math.round(new Date().getTime() / 1000) + 1800)

      return true
    } else {
      return false
    }
  }
}
