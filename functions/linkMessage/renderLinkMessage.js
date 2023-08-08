const bot = require('@/bot');
const axios = require('axios').default;

const renderLinkMessage = async (chatId) => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    let editedText = `Ссылки на дз:\n`;
    await hwLinks.map((hw) => {
        editedText = editedText.concat(`-------------------\n`);
        editedText = editedText.concat(
            `<a href="${hw.link}">${hw.lessonTitle}</a>\n`
        );
    });

    const linkMessageId = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/vars')
        .then(res => res.data[0]["vars"]["LINK_MESSAGE_ID"]);

    if (!linkMessageId) {
        console.log("LINK_MESSAGE_ID is not exist now");
        return;
    }

    await bot.editMessageText(editedText, {
        parse_mode: "HTML",
        chat_id: chatId,
        message_id: linkMessageId,
    });
}

module.exports = renderLinkMessage;