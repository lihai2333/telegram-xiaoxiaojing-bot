import Ad from '../lib/ad'

const ad = new Ad()

export default async (ctx: any): Promise<void> => {
  if (ctx.chat.type !== 'private') {
    return
  }

  const result = await ad.check(ctx.from.id)

  if (result === null) {
    return
  }

  ctx.reply(`${JSON.parse(result).quota}`)
}
