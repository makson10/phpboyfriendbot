const bot = require("@/bot");

const sendKillSticker = async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const stickerFileId = "CAACAgIAAxkBAAIZJmTVSBxtUUnqk41L5j5NmDjQtPyBAAIrFAACt5nIS_UUZ5bBuI9VMAQ";

  const messageToReply = msg.hasOwnProperty("reply_to_message")
      ? msg.reply_to_message.message_id
      : undefined;

  await bot.deleteMessage(chatId, messageId);
  await bot.sendSticker(chatId, stickerFileId, {
    reply_to_message: messageToReply,
  });
};

module.exports = sendKillSticker;
