const bot = require('@/bot');

bot.on('error', (error) => console.log(error));
bot.on('polling_error', (error) => console.log(error));
bot.on('webhook_error', (error) => console.log(error));