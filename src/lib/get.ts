import * as fetch from 'node-fetch'
import * as cheerio from 'cheerio'

interface Get {
  username: string
  type: 'channel' | 'bot' | 'supergroup' | undefined
  title: string
  description: string
  members: number
}

/**
 * 获取频道和机器人的信息
 *
 * @param username - 去除 `@` 的 username
 * @returns 返回频道或机器人的信息
 */
export default async (username: string): Promise<Get> => {
  const obj: Get = {
    type: undefined,
    username: '',
    title: '',
    description: '',
    members: 0
  }

  const result = await fetch(`https://t.me/${username}`)
  const html = await result.text()
  const $ = cheerio.load(html.replace(/<br\/>/g, '\n'))

  if ($('.tgme_action_button_label').text() === 'Preview channel') {
    obj.type = 'channel'
    obj.members = Number($('.tgme_page_extra').text().replace('subscribers', '').replace(/\s/g, ''))
  } else if ($('.tgme_page_extra').text().match('members') !== null) {
    obj.type = 'supergroup'
    obj.members = Number($('.tgme_page_extra').text().split(',')[0].replace('members', '').replace(/\s/g, ''))
  } else if ($('.tgme_page_additional').text() &&
             username.toLowerCase().endsWith('bot')) {
    obj.type = 'bot'
  } else {
    return obj
  }

  obj.username = $('title').text().split('@')[1] ?? ''
  obj.title = $('.tgme_page_title span').text()
  obj.description = $('.tgme_page_description').text() ?? ''

  return obj
}
