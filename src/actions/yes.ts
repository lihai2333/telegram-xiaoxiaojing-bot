import Search from '../lib/search'

import get from '../lib/get'

import config from '../config'

import { markdown } from '../lib/escape'

type t = 'bot' | 'supergroup' | 'channel'

const search = new Search()

export default async (ctx: any): Promise<void> => {
  if (!config.admin.includes(String(ctx.from.id))) {
    return
  }

  const text: string = ctx.callbackQuery.message.text
  const username: string = text.split('\n')[0].replace('Username: @', '')
  const typing: t = text.split('\n')[1].replace('Type: ', '') as t

  const obj = await get(username)

  if (obj.type === undefined) {
    ctx.answerCbQuery(ctx.i18n.t('notExist'), { show_alert: true })
    return
  }

  await search.add(
    username,
    obj.title,
    obj.description,
    typing,
    obj.members
  )

  await search.removeAuditing(username)

  ctx.replyWithMarkdown(`*Title*: [${markdown(obj.title)}](https://t.me/${username})
*Description*:
${markdown(obj.description)}`, {
    chat_id: config.channel,
    disable_web_page_preview: true
  })

  ctx.deleteMessage()
}
