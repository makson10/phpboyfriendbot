const bot = require('@/bot');

const shock = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const replyMessageId = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, "Нихуя себе", {
        reply_to_message_id: replyMessageId,
    });
}

module.exports = shock;