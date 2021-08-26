import Search from '../lib/search'

import get from '../lib/get'

const search = new Search()

type t = 'bot' | 'supergroup' | 'channel'

async function check (username: string): Promise<boolean> {
  const result1 = await search.check(username.toLowerCase())
  if (result1) {
    return true
  }

  return false
}

export default async (ctx: any) => {
  const option: string = ctx.message.text.split(' ')[1]

  if (option === undefined) {
    ctx.reply(ctx.i18n.t('updateHelp'))
    return
  }

  if (ctx.chat.type === 'private' &&
     (option.replace(/^@[a-z][a-z0-9_]{2,30}[a-z0-9]$/i, '') ||
      option.replace(/_{2,}/g, '_') !== option ||
      option.toLowerCase().startsWith('@admin'))) {
    ctx.reply(ctx.i18.t('updateError'))
    return
  }

  ctx.replyWithChatAction('typing')

  const result1: boolean = await check(option.replace('@', ''))

  if (result1 === false) {
    ctx.reply(ctx.i18n.t('notIncluded'))
    return
  }

  const obj = await get(option.replace('@', ''))

  if (obj.type === 'NSFWchannel') {
    const result = await ctx.telegram.getChat(option)
    const members: number = await ctx.telegram.getChatMembersCount(option)

    obj.title = result.title
    obj.description = result.description
    obj.members = members
  }

  const result2: boolean = await search.checkUpdateList(option.toLowerCase().replace('@', ''))

  if (result2) {
    ctx.reply(ctx.i18n.t('updateSuccess'))

    await search.update(option.toLowerCase().replace('@', ''), obj.title, obj.description, obj.type as t, obj.members)
  } else {
    ctx.reply(ctx.i18n.t('updateFailed'))
  }
}
