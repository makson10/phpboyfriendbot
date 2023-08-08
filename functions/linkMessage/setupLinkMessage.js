const bot = require('@/bot');
const axios = require('axios').default;

const sendErrorMessageToUser = (chatId, messageId) => {
    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(
        chatId,
        "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
    );
}

const shouldHandleMessage = (msg) => {
    if (!isMessageFromSuperAdmin(msg)) {
        sendErrorMessageToUser(msg.chat.id, msg.message_id);
    } else return true;
}

const updateDataAboutLinkMessage = async (messageId) => {
    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/api/vars/setLinkMessage',
        { linkMessageId: messageId + 1 }
    );
};

const getHWLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    return hwLinks;
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

const setupLinkMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (!shouldHandleMessage(msg)) return;

    updateDataAboutLinkMessage(messageId);
    const newLinkMessageText = await formNewLinkMessage();

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, newLinkMessageText, {
        parse_mode: "HTML",
    });
}

module.exports = setupLinkMessage;