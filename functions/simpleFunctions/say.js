const bot = require('@/bot');

const say = (msg, match) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const messageToSay = match[1];

    const messageToReply = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, messageToSay, {
        reply_to_message_id: messageToReply
    });
}

module.exports = say;