const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;

//* For Dev:
const bot = new TelegramBot(TOKEN, { polling: true });

//* For Prod:
// const bot = new TelegramBot(TOKEN);
// bot.setWebHook('https://phpboyfriendbotwebhook.onrender.com/' + TOKEN);

module.exports = bot;