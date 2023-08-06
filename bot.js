const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;

//* For Dev:
const bot = new TelegramBot(TOKEN, { polling: true });

//* For Prod:
// const bot = new TelegramBot(TOKEN);
// bot.setWebHook('https://phpboyfriendbotwebhook.onrender.com/' + TOKEN);

// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// app.post(`/${TOKEN}`, (req, res) => {
//     bot.processUpdate(req.body);
//     res.sendStatus(200);
// });

module.exports = bot;