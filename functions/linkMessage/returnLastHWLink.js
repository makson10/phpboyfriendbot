const bot = require('@/bot');
const axios = require('axios').default;
const fs = require('fs/promises');
const renderLinkMessage = require('./renderLinkMessage');

const returnLastHWLink = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const data = await fs.readFile('./assets/lastDeletedLink.json', 'utf-8') || '{}';
    const deletedLink = await JSON.parse(data);

    if (!deletedLink.lessonTitle) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, 'У меня пока что нету последнего удаленного сообщения, чтоб его вернуть(');
        return;
    }

    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw', deletedLink);

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, 'Последнее удаленное сообщение вернулось в строй');
    await renderLinkMessage(chatId);
}

module.exports = returnLastHWLink;