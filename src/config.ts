export default {
  token: process.env.TELEGRAM_SEARCH_BOT_TOKEN || '', // Telegram Bot API Token
  admin: process.env.TELEGRAM_SEARCH_BOT_ADMIN.split(',') || [],
  group: process.env.TELEGRAM_SEARCH_BOT_GROUP || 12345,
  channel: process.env.TELEGRAM_SEARCH_BOT_CHANNEL || 12345,

  solr: {
    host: process.env.SOLR_HOST || '127.0.0.1', // Solr host
    port: process.env.SOLR_PORT || '8983', // Solr port
    core: process.env.SOLR_CORE || 'xiaoxiaojing', // Solr core
    protocol: process.env.SOLR_PROTOCOL || 'http' // Solr protocol
  },

  redis: {
    host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1', // Redis host
    port: process.env.TELEGRAM_SESSION_PORT || 6379 // Redis port
  }
}
