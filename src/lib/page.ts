import { Markup } from 'telegraf'

/**
 * 翻页按钮
 *
 * @param rNumber - 下一次结果的数量
 * @param page    - 下一次结果的页数
 * @param base64  - 解码后格式: `关键词 上一次结果的页数`
 * @param ctx     - Context
 * @returns 按钮样式
 */
export default (rNumber: number, page: number, base64: string, ctx: any) => {
  if (rNumber === 11 && page === 1) {
    return Markup.inlineKeyboard([
      Markup.button.callback(ctx.i18n.t('nextpage'), `${base64}nextpage`)
    ])
  } else if (page > 1) {
    if (rNumber === 11) {
      return Markup.inlineKeyboard([
        Markup.button.callback(ctx.i18n.t('lastpage'), `${base64}lastpage`),
        Markup.button.callback(ctx.i18n.t('nextpage'), `${base64}nextpage`)
      ])
    } else {
      return Markup.inlineKeyboard([
        Markup.button.callback(ctx.i18n.t('lastpage'), `${base64}lastpage`)
      ])
    }
  }
}
