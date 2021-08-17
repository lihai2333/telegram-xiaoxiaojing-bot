import config from '../config'

import Search from '../lib/search'

const search = new Search()

export default (ctx: any) => {
  if (!config.admin.includes(String(ctx.from.id))) {
    return
  }

  const text: string = ctx.callbackQuery.message.text
  const username: string = text.split('\n')[0].replace('Username: @', '')

  search.removeAuditing(username)
  search.addBlockList(username, Math.round(new Date().getTime() / 1000) + 60 * 60 * 24 * 1)

  ctx.deleteMessage()
}
