const bot = require('@/bot');
const { rofl, meme, shock, say, spam, sendKillSticker, sendStikerAfterGetHW } = require('@functions/simpleFunctions');

bot.onText(/^\/rofl/, (msg) => rofl(msg));
bot.onText(/^\/meme/, (msg) => meme(msg));
bot.onText(/^\/shock/, (msg) => shock(msg));
bot.onText(/^\/kill/, (msg) => sendKillSticker(msg));
bot.onText(/^\/say (.+)/gms, (msg, match) => say(msg, match));
bot.onText(/^\/spam (.+)/, (msg, match) => spam(msg, match));
bot.on("document", (msg) => sendStikerAfterGetHW(msg));
