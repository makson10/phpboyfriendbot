const bot = require('@/bot');
const { getHWLinks, getLinkMessageId } = require('@functions/dbRequestFunctions');

const formNewLinkMessageText = async (hwLinks) => {
    let newText = 'Ссылки на дз:\n';
    await hwLinks.map((hw) => {
        newText += '-------------------\n';
        newText += `<a href="${hw.link}">${hw.lessonTitle}</a>\n`;
    });

    return newText;
};

const updateLinkMessage = async (chatId, linkMessageId, newText) => {
    await bot.editMessageText(newText, {
        parse_mode: "HTML",
        chat_id: chatId,
        message_id: linkMessageId,
    });
};

const renderLinkMessage = async (chatId) => {
    const hwLinks = await getHWLinks();
    const linkMessageId = await getLinkMessageId();
    if (!linkMessageId) return;

    const newLinkMessageText = await formNewLinkMessageText(hwLinks);
    await updateLinkMessage(chatId, linkMessageId, newLinkMessageText);
}

module.exports = renderLinkMessage;