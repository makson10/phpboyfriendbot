const bot = require("@/bot");

const sendKillSticker = async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  await bot.deleteMessage(chatId, messageId);
  await bot.sendSticker(chatId, "AAMCAgADGQEAAhkmZNVIHG1RSeqTjUvmPK2YONCO_IEAAisUAAK3mchL9RTP1sG4j1UBAAdtAAMWBA");
};

module.exports = sendKillSticker;
