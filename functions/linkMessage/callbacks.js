const bot = require('@/bot');
const axios = require('axios').default;
const renderLinkMessage = require('./renderLinkMessage');

const deleteHw = async (lessonTitle) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/hw/delete', { lessonTitle });
};

const deleteAllLinksFromServer = async () => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/hw/deleteAllHw');
};

const callbackDeleteLink = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const choosenOption = callbackQuery.data;

    if (!choosenOption.match(/deleteLink_/)) return;
    await bot.deleteMessage(chatId, messageId);

    if (choosenOption === 'deleteLink_cancel') return;
    await deleteHw(choosenOption);
    await renderLinkMessage(chatId);
}

const callbackDeleteAllLink = async (callbackQuery) => {
    const messageId = callbackQuery.message.message_id;
    const chatId = callbackQuery.message.chat.id;
    const userChoise = callbackQuery.data;

    if (!userChoise.match(/deleteAllLink_/)) return;
    await bot.deleteMessage(chatId, messageId);

    if (userChoise === "deleteAllLink_yes") {
        await deleteAllLinksFromServer();
        await renderLinkMessage(chatId);
    }
}

module.exports = {
    callbackDeleteLink,
    callbackDeleteAllLink,
}