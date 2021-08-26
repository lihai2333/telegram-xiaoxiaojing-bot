import Ad from '../lib/ad'

import config from '../config'

const ad = new Ad()

export default async (ctx: any) => {
  if (+config.admin[0] !== ctx.from.id || ctx.chat.type !== 'private') {
    return
  }

  const options = ctx.message.text.split(' ').slice(1)

  if (options.length !== 2) {
    return
  }

  ad.addAdContent(options[0], options[1])

  ctx.reply('ok!')
}
