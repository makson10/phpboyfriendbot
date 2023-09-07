const bot = require('@/bot');

const shock = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const replyMessageId = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, "Нихуя себе", {
        reply_to_message_id: replyMessageId,
        disable_notification: true,
    });
}

module.exports = shock;