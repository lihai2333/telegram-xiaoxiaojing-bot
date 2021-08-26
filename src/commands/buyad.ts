import config from '../config'

export default (ctx: any) => {
  if (ctx.chat.type !== 'private') {
    return
  }

  ctx.reply(config.buyadUsername)
}
