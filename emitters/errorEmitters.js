const bot = require('@/bot');

bot.on('error', console.log);
bot.on('polling_error', console.log);
bot.on('webhook_error', console.log);