import Ad from '../lib/ad'

import config from '../config'

const ad = new Ad()

export default async (ctx: any) => {
  if (+config.admin[0] !== ctx.from.id || ctx.chat.type !== 'private') {
    return
  }

  const option = ctx.message.text.split(' ').slice(1)

  if (option.length !== 2) {
    return
  }

  ad.add(option[0], Number(option[1]))

  ctx.reply('ok!')
}
