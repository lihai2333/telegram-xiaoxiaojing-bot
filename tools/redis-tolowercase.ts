import * as redis from 'redis'

import { promisify } from 'util'

const client = redis.createClient('redis://127.0.0.1:6379')

async function toLowercase () {
  const HGETALL = promisify(client.HGETALL).bind(client)
  const HDEL = promisify(client.HDEL).bind(client)
  const HSET = promisify(client.HSET).bind(client)

  const results: string[] = await HGETALL('xiaoxiaojingAddList')

  for (let i in results) {
    await HDEL('xiaoxiaojingAddList', i)
    console.log(i.toLowerCase(), results[i])
    await HSET('xiaoxiaojingAddList', i.toLowerCase(), results[i])
  }
}

toLowercase()
