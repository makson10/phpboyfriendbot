const bot = require('@/bot');
const { rofl, meme, shock, say, spam, sendKillSticker, sendStikerAfterGetHW } = require('@functions/simpleFunctions');

bot.onText(/^\/rofl/, rofl);
bot.onText(/^\/meme/, meme);
bot.onText(/^\/shock/, shock);
bot.onText(/^\/kill/, sendKillSticker);
bot.onText(/^\/say (.+)/gms, say);
bot.onText(/^\/spam (.+)/, spam);
bot.on("document", sendStikerAfterGetHW);
