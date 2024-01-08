const bot = require("@/bot");
const { default: axios } = require("axios");

const setReactionToMessage = async (msg, match) => {
    const emojiToSend = !!match[1] ? match[1] : '💩';
    const chatId = -1001764912680;
    const messageId = msg.message_id;
    const messageForReaction = msg.reply_to_message ? msg.reply_to_message.message_id : msg.message_id;
    const emoji = JSON.stringify([{ type: 'emoji', emoji: emojiToSend }]);

    const url = `https://api.telegram.org/bot${process.env.TOKEN}/setMessageReaction?chat_id=${chatId}&message_id=${messageForReaction}&reaction=`;
    const urlForFetch = url + encodeURIComponent(emoji);

    await axios.get(urlForFetch);
    await bot.deleteMessage(chatId, messageId);
}

module.exports = setReactionToMessage;