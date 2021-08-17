import results from '../lib/results'
import page from '../lib/page'

export default async (ctx: any): Promise<any> => {
  if (ctx.chat.type !== 'private' ||
     isNaN(ctx.callbackQuery.message.text.split('\n').slice(-1).slice(0, ctx.callbackQuery.message.text.split('\n').slice(-1).indexOf('.')))) {
    return
  }

  const str: string = Buffer.from(ctx.callbackQuery.data.replace(/nextpage$/, ''), 'base64').toString()
  const keyword: string = str.slice(0, str.lastIndexOf(' '))
  const pages: number = Number(str.slice(str.lastIndexOf(' ') + 1))

  ctx.answerCbQuery()

  const result = await results(keyword, pages * 10)

  if (result[1] === 0) {
    return
  }

  ctx.editMessageText(result[0], {
    ...page(result[1], pages + 1, Buffer.from(`${keyword} ${pages + 1}`).toString('base64'), ctx),
    disable_web_page_preview: true,
    parse_mode: 'Markdown'
  })
}
