const API = require('node-vk-bot-api')
const { router, clear, count, dispatch, stop } = require('./controller')

const bot = new API(process.env.TOKEN) // Group API key

bot.command('отменить', clear) // delete user and message
bot.command('_clear', clear) // alias
bot.command('_stop', stop)  // prevent new dialogs 
bot.command('_count', count) // count of dialogs
bot.command('_dispatch', dispatch) // mix messages and reply to all

bot.on(router)
 
bot.listen()