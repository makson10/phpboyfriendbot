const bot = require("@/bot");

const sendKillSticker = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const stickerFileId = "CAACAgIAAxkBAAIZb2TuWr88zr6w0LOcGgezbE1x1LrBAAIrFAACt5nIS_UUz5bBuI9VMAQ";

    const messageToReply = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    await bot.deleteMessage(chatId, messageId);
    await bot.sendSticker(chatId, stickerFileId, {
        reply_to_message_id: messageToReply,
        disable_notification: true,
    });
};

module.exports = sendKillSticker;
