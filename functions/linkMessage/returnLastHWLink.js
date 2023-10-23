const bot = require('@/bot');
const axios = require('axios').default;

const sendReturnRequestToServer = async () => {
    const result = await axios
        .post(process.env.MEDIATOR_BASE_URL + '/history/returnLastDeletedLink')
        .then((res) => res.data);

    return result;
}

const returnLastHWLink = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await bot.deleteMessage(chatId, messageId);
    const result = await sendReturnRequestToServer();

    if (result.ok) {
        await bot.sendMessage(chatId, 'Последнее удаленное сообщение вернулось в строй');
    } else {
        await bot.sendMessage(chatId, 'Удаленных ссылков в истории не оказалось');
    }
}

module.exports = returnLastHWLink;