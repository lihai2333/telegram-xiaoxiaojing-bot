export default (ctx: any) => {
  if (ctx.chat.type !== 'private') {
    return
  }

  ctx.replyWithMarkdown(ctx.i18n.t('start'))
}
