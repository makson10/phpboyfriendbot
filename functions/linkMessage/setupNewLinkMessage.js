const bot = require('@/bot');
const axios = require('axios').default;
const { getLinkMessageId } = require('@/functions/handleFunction/dbRequestFunctions');
const renderLinkMessage = require('./renderLinkMessage');

const updateDataAboutLinkMessage = async (messageId) => {
    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/vars/updateLinkMessageId',
        { newLinkMessageId: messageId }
    );
};

const sendStartLinkMessage = async (chatId, newLinkMessageText) => {
    const newLinkMessage = await bot.sendMessage(chatId, newLinkMessageText, {
        parse_mode: "HTML",
    });

    return newLinkMessage.message_id;
};

const unpinOldLinkMessage = async (chatId, oldLinkMessageId) => {
    await bot.unpinChatMessage(chatId, { message_id: oldLinkMessageId });
};

const pinNewLinkMessage = async (chatId, newLinkMessageId) => {
    await bot.pinChatMessage(chatId, newLinkMessageId, { disable_notification: true });
};

const unpinOldLinkMessageAndPinNew = async (chatId, oldLinkMessageId, newLinkMessageId) => {
    await unpinOldLinkMessage(chatId, oldLinkMessageId);
    await pinNewLinkMessage(chatId, newLinkMessageId);
};

const sendNewLinkMessage = async (chatId) => {
    const oldLinkMessageId = await getLinkMessageId();
    const newMessageText = 'Ссылки на дз:';
    const newLinkMessageId = await sendStartLinkMessage(chatId, newMessageText);

    await unpinOldLinkMessageAndPinNew(chatId, oldLinkMessageId, newLinkMessageId);
    await updateDataAboutLinkMessage(newLinkMessageId);
};

const setupNewLinkMessage = async (msg, shouldDeleteCommandMessage = true) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await sendNewLinkMessage(chatId);
    await renderLinkMessage();
    if (shouldDeleteCommandMessage) await bot.deleteMessage(chatId, messageId);
}

module.exports = setupNewLinkMessage;