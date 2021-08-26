import * as redis from 'redis'

import { promisify } from 'util'

import config from '../config'

const client = redis.createClient(`redis://${config.redis.host}:${config.redis.port}`)

const HSET = promisify(client.HSET).bind(client)
const HGET = promisify(client.HGET).bind(client)
const HDEL = promisify(client.HDEL).bind(client)
const HGETALL = promisify(client.HGETALL).bind(client)

const q = new Map()

setInterval(() => {
  q.clear()
}, 60 * 1000)

export default class Ad {
  /**
   * 增加广告发放次数
   *
   * @param id        - Userid
   * @param frequency - 增加次数
   */
  async add (id: number, frequency: number): Promise<void> {
    const result: string | null = await this.check(id)

    HSET('xiaoxiaojingAd', id, result === null
      ? JSON.stringify({
        text: [],
        stint: 20,
        quota: frequency
      })
      : JSON.stringify(JSON.parse(result).quota + frequency))
  }

  /**
   * 检测
   *
   *  @param id - Userid
   */
  async check (id: number): Promise<null | string> {
    return await HGET('xiaoxiaojingAd', id)
  }

  /**
   * 增加广告内容
   *
   * @param id      - Userid
   * @param content - 广告内容
   */
  async addAdContent (id: number, content: string): Promise<void> {
    let result: any = await this.check(id)
    result = JSON.parse(result)

    HSET('xiaoxiaojingAd', id, result === null
        ? JSON.stringify({
          text: [content],
          stint: 20,
          quota: 0
        })
        : (result.text.push(content), JSON.stringify(result)))
  }

  /**
   * 随机获取广告内容
   *
   * @returns 广告内容
   */
  async getAdContent (): Promise<string> {
    const results = await HGETALL('xiaoxiaojingAd')

    const l: number = Object.keys(results).length

    const random: number = Math.round(Math.random() * (l === 1 ? 0 : l))

    const id = Object.keys(results)[random]

    const { text, stint, quota } = JSON.parse(results[id])

    let s = q.get(id)

    if (s > stint) {
      return ''
    }

    s = s === undefined ? (q.set(id, 1), 1) : (q.set(id, s + 1), s + 1)

    if ((quota - 1) === 0) {
      HDEL('xiaoxiaojingAd', id)
    } else {
      HSET('xiaoxiaojingAd', id, JSON.stringify({
        text,
        stint,
        quota: quota - 1
      }))
    }

    return text
  }
}
