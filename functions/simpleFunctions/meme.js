const bot = require('@/bot');
const memesLink = require("@assets/memesLink");

const chooseRandomMeme = (memes) => {
    const randomNumber = Math.floor(Math.random() * (memes.length - 1) + 1);
    return memes[randomNumber];
}

const meme = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const memeToSend = chooseRandomMeme(memesLink);

    bot.deleteMessage(chatId, messageId);
    bot.sendPhoto(chatId, memeToSend, { disable_notification: true });
}

module.exports = meme;