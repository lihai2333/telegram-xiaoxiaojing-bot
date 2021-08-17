import { Markup } from 'telegraf'

import { settings } from '../lib/markup'

export default (ctx: any): void => {
  ctx.answerCbQuery()

  const text: string = ctx.callbackQuery.data

  if (text === 'settings/') {
    ctx.editMessageText(ctx.i18n.t('settings/'), {
      ...settings
    })

    return
  }

  const setting = text.replace('settings/', '').split('/')
  const back = Markup.button.callback('\u2B05\uFE0F ' + ctx.i18n.t('settingsBack'), 'settings/')
  const obj = {
    setlanguage: (lang: string) => {
      if (['english', 'chinese'].includes(lang)) {
        const k = {
          english: 'en',
          chinese: 'zh-hans'
        }

        setting[0] = ''

        ctx.i18n.locale(k[lang])
        
        return settings(ctx)
      }

      return Markup.inlineKeyboard([[
        Markup.button.callback('\uD83C\uDDE8\uD83C\uDDF3 简体中文', 'settings/setlanguage/chinese')
      ], [
        Markup.button.callback('\uD83C\uDDEC\uD83C\uDDE7 English', 'settings/setlanguage/english')
      ], [
        back
      ]])
    },
    ad: () => {
      ctx.session.ad = !ctx.session.ad

      setting[0] = ''

      return settings(ctx)
    }
  }

  if (obj[setting[0]] === undefined) {
    return
  }

  const markup = obj[setting[0]](setting[1] ?? '')

  ctx.editMessageText(ctx.i18n.t('settings/' + setting[0]), {
    ...markup
  })
}

