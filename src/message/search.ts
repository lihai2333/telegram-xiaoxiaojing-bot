import results from '../lib/results'

import page from '../lib/page'

export default async (ctx: any): Promise<void> => {
  if (ctx.chat.type !== 'private') {
    return
  }

  if (ctx.message.text.length > 20) {
    ctx.reply(ctx.i18n.t('searchError1'))
    return
  }

  const result = await results(ctx.message.text, 0)

  if (result[1] === 11) {
    ctx.replyWithMarkdown(result[0], {
      ...page(11, 1, Buffer.from(`${ctx.message.text} 1`).toString('base64'), ctx),
      disable_web_page_preview: true
    })
  } else if (result[1] === 0) {
    ctx.reply(ctx.i18n.t('noResult'))
  } else {
    ctx.replyWithMarkdown(result[0], { disable_web_page_preview: true })
  }
}
