import { Context, Telegraf } from 'telegraf'
import * as TelegrafI18n from 'telegraf-i18n'
import * as RedisSession from 'telegraf-session-redis'

import * as path from 'path'

import config from './config'

// Commands import
import add from './commands/add'
import update from './commands/update'
import help from './commands/help'
import start from './commands/start'
import settings from './commands/settings'

// Actions import
import lastpage from './actions/lastpage'
import nextpage from './actions/nextpage'
import yes from './actions/yes'
import no from './actions/no'
import actionSettings from './actions/settings'

import search from './message/search'

const i18n: any = new TelegrafI18n({
  defaultLanguage: 'en',
  useSession: true,
  directory: path.resolve(process.cwd(), '../locales')
})

const bot: any = new Telegraf<Context>(config.token)

const session: any = new RedisSession({
  store: {
    host: config.redis.host,
    port: config.redis.port
  }
})

bot.use(session)
bot.use(i18n.middleware())

bot.start(start)
bot.help(help)
bot.settings(settings)

bot
  .command('add', add)
  .command('update', update)

bot
  .action(/^.+lastpage$/, lastpage)
  .action(/^.+nextpage$/, nextpage)
  .action('yes', yes)
  .action('no', no)
  .action(/^settings(\/.+)?/, actionSettings)

bot.on('text', search)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
