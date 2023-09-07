const bot = require('@/bot');

const say = async (msg, match) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const messageToSay = match[1];

    const messageToReply = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, messageToSay, {
        reply_to_message_id: messageToReply,
        disable_notification: true,
    });
}

module.exports = say;