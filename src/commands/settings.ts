import { settings } from '../lib/markup'

export default (ctx: any): Promise<void> => {
  if (ctx.chat.type !== 'private') {
    return
  }

  ctx.reply(ctx.i18n.t('settings/'), {
    ...settings(ctx)
  })
}
