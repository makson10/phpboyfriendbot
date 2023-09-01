const bot = require('@/bot');
const axios = require('axios').default;
const { getHWLinks, getLinkMessageId } = require('@/functions/handleFunction/dbRequestFunctions');

const updateDataAboutLinkMessage = async (messageId) => {
    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/vars/updateLinkMessageId',
        { newLinkMessageId: messageId }
    );
};

const formNewLinkMessage = async (msg) => {
    const hwLinks = await getHWLinks();

    let newLinkMessageText = `Ссылки на дз:\n`;
    await hwLinks.map((hw) => {
        newLinkMessageText += '-------------------\n';
        newLinkMessageText += `<a href="${hw.link}">${hw.lessonTitle}</a>\n`;
    });

    return newLinkMessageText;
};

const sendNewLinkMessage = async (chatId, newLinkMessageText) => {
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

const renderNewLinkMessage = async (chatId) => {
    const oldLinkMessageId = await getLinkMessageId();
    const newLinkMessageText = await formNewLinkMessage();
    const newLinkMessageId = await sendNewLinkMessage(chatId, newLinkMessageText);

    await unpinOldLinkMessageAndPinNew(chatId, oldLinkMessageId, newLinkMessageId);
    await updateDataAboutLinkMessage(newLinkMessageId);
};

const setupNewLinkMessage = async (msg, shouldDeleteCommandMessage = true) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await renderNewLinkMessage(chatId);
    if (shouldDeleteCommandMessage) await bot.deleteMessage(chatId, messageId);
}

module.exports = setupNewLinkMessage;