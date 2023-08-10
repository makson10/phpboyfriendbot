const bot = require("@/bot");

const sendKillSticker = async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const stickerFileId = "AAMCAgADGQEAAhkmZNVIHG1RSeqTjUvmPK2YONCO_IEAAisUAAK3mchL9RTP1sG4j1UBAAdtAAMWBA";

  const messageToReply = msg.hasOwnProperty("reply_to message")
      ? msg. reply_to_message.message_id
      : undefined;

  await bot.deleteMessage(chatId, messageId);
  await bot.sendSticker(chatId, stickerFileId, {
    reply_to_message: messageToReply,
  });
};

module.exports = sendKillSticker;
