const bot = require('@/bot');
const axios = require('axios').default;
const fs = require('fs/promises');
const renderLinkMessage = require('./renderLinkMessage');

const getHwLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    return hwLinks;
};

const getDeletedLink = async (hwLinks, deletedLessonTitle) => {
    return hwLinks.find(link => link.lessonTitle === deletedLessonTitle);
};

const sendRequestToDeleteAllHwLinks = async () => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw/remove/all');
};

const sendRequestToDeleteSpecificHwLinks = async (lessonTitle) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw/remove', { lessonTitle });
};

const deleteLinkFromServer = async (linksAmount, linkTitle) => {
    if (linksAmount === 1) {
        await sendRequestToDeleteAllHwLinks();
    } else {
        await sendRequestToDeleteSpecificHwLinks(linkTitle);
    }
};

const updateLastDeletedLink = async (deletedLink) => {
    await fs.writeFile('./assets/lastDeletedLink.json', JSON.stringify(deletedLink));
};

const callbackDeleteLink = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const choosenOption = callbackQuery.data;

    if (choosenOption === 'allLinkDeleteYes' || choosenOption === 'allLinkDeleteNo' || choosenOption === 'cancel') {
        return await bot.deleteMessage(chatId, messageId);
    }

    const hwLinks = await getHwLinks();
    const deletedLink = await getDeletedLink(hwLinks, choosenOption);

    await updateLastDeletedLink(deletedLink);
    await deleteLinkFromServer(hwLinks.length, choosenOption);

    await bot.deleteMessage(chatId, messageId);
}

const callbackDeleteAllLink = async (callbackQuery) => {
    const userChoise = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (userChoise === "allLinkDeleteYes") {
        await sendRequestToDeleteAllHwLinks();
        await renderLinkMessage(chatId);
    }
}

module.exports = {
    callbackDeleteLink,
    callbackDeleteAllLink,
}