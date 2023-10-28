const bot = require('@/bot');
const { getHWLinks, getLinkMessageId, getSupergroupId } = require('@/functions/handleFunction/dbRequestFunctions');

const dateRegex = /[0-3][0-9].[0-1][0-9]/gm;

const formNewLinkMessageText = async (hwLinks) => {
    let newText = 'Ссылки на дз:\n';
    newText += '-------------------\n';

    await hwLinks.map((hw, index) => {
        const hwTitle = hw.lessonTitle;

        newText += `<a href="${hw.link}">${hw.lessonTitle}</a>\n`;

        if (hwLinks.length === index + 1) return;

        const nextHwTitle = hwLinks[index + 1].lessonTitle;

        if (!hwTitle.match(dateRegex) || !nextHwTitle.match(dateRegex)) {
            newText += '-------------------\n';
            return;
        }

        const homeworkDate = hwTitle.match(dateRegex);
        let [homeworkDay, homeworkMonth] = homeworkDate[0].split('.');
        [homeworkDay, homeworkMonth] = [+homeworkDay, +homeworkMonth];

        const nextHomeworkDate = nextHwTitle.match(dateRegex);
        let [nextHomeworkDay, nextHomeworkMonth] = nextHomeworkDate[0].split('.');
        [nextHomeworkDay, nextHomeworkMonth] = [+nextHomeworkDay, +nextHomeworkMonth];

        if (homeworkDay !== nextHomeworkDay || nextHomeworkMonth !== homeworkMonth) {
            newText += '-------------------\n';
        }
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

const renderLinkMessage = async () => {
    const hwLinks = await getHWLinks();
    const linkMessageId = await getLinkMessageId();
    const chatId = await getSupergroupId();
    if (!linkMessageId || !chatId) return;

    const newLinkMessageText = await formNewLinkMessageText(hwLinks);
    await updateLinkMessage(chatId, linkMessageId, newLinkMessageText);
}

module.exports = renderLinkMessage;