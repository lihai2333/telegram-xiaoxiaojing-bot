import get from '../lib/get'

import { Markup } from 'telegraf'

import config from '../config'

import Search from '../lib/search'

const search = new Search()

type t = 'bot' | 'supergroup' | 'channel'

async function check (username: string): Promise<boolean> {
  const result1 = await search.check(username)
  if (result1) {
    return true
  }

  const result2 = await search.checkAuditing(username)
  if (result2) {
    return true
  }

  const result3 = await search.checkBlockList(username)
  if (result3) {
    return true
  }
}

export default async (ctx: any): Promise<void> => {
  const option: string = ctx.message.text.split(' ')[1]

  ctx.replyWithChatAction('typing')

  let type: t = 'supergroup'

  if (option === undefined && ctx.chat.type === 'private') {
    ctx.replyWithMarkdown(ctx.i18n.t('addHelp'))
    return
  } else if (ctx.chat.type === 'private' &&
            (option.replace(/^@[a-z][a-z0-9_]{2,30}[a-z0-9]$/i, '') ||
             option.replace(/_{2,}/g, '_') !== option ||
             option.toLowerCase().startsWith('@admin'))) {
    ctx.reply(ctx.i18n.t('addError'))
    return
  } else if (ctx.chat.type === 'private') {
    const data = await get(option.replace('@', ''))

    if (data.type === undefined) {
      ctx.reply(ctx.i18n.t('addError'))
      return
    }

    ctx.chat.username = option.toLowerCase().replace('@', '')
    type = data.type as t
  }

  if (ctx.chat.type === 'group') {
    ctx.i18n.t('noSupport')
    return
  }

  if (ctx.chat.type === 'supergroup') {
    const member: Member =
      await ctx.getChatMember(ctx.from.id)

    if (!['administrator', 'creator'].includes(member.status)) {
      return
    }
  }

  const result: boolean = await check(ctx.chat.username.toLowerCase())

  if (result) {
    ctx.reply(ctx.i18n.t('alreadyExist'))
    return
  }

  ctx.reply(ctx.i18n.t('addSuccess'))

  await search.addAuditing(ctx.chat.username.toLowerCase())

  ctx.replyWithMarkdown(`*Username*: @${ctx.chat.username.toLowerCase().replace(/_/g, '\\_')}
*Type*: ${type}`, {
    chat_id: config.group,
    ...Markup.inlineKeyboard([
      Markup.button.callback('通过', 'yes'),
      Markup.button.callback('不通过', 'no')
    ])
  })
}
