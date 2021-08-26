import Search from '../lib/search'

import get from '../lib/get'

import config from '../config'

import { markdown } from '../lib/escape'

const search = new Search()

export default async (ctx: any): Promise<void> => {
  if (!config.admin.includes(String(ctx.from.id))) {
    return
  }

  const text: string = ctx.callbackQuery.message.text
  const username: string = text.split('\n')[0].replace('Username: @', '')

  const obj = await get(username)

  if (obj.type === undefined) {
    ctx.answerCbQuery(ctx.i18n.t('notExist'), { show_alert: true })
    return
  }

  ctx.answerCbQuery()

  if (obj.type === 'NSFWchannel') {
    const result = await ctx.telegram.getChat(`@${username}`)
    const members: number = await ctx.telegram.getChatMembersCount(username)

    obj.title = result.title
    obj.description = result.description
    obj.members = members
  }

  await search.add(
    obj.username,
    obj.title,
    obj.description,
    obj.type,
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
