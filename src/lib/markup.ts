import { Markup } from 'telegraf'

export function settings (ctx: any) {
  ctx.session.ad ??= true

  return Markup.inlineKeyboard([[
    Markup.button.callback(ctx.i18n.t('settings1') + ' ' + (ctx.session.ad ? '\u2705' : '\u274E'), 'settings/ad')
  ], [
    Markup.button.callback('Set Language', 'settings/setlanguage')
  ]])
}
