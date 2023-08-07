const bot = require('@/bot');
const cheerio = require("cheerio");
const axios = require('axios').default;

const getPageWithRoflsMarkup = async () => {
    const markup = await axios.get('https://etnosvit.com/anekdoty.html', {
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    }).then(res => res.data);

    return markup;
};

const formRoflsArray = (pageMarkup) => {
    const $ = cheerio.load(pageMarkup);
    const rofls = [];

    $('.sue-panel-content').each((i, elem) => {
        const element = $(elem);
        const elementText = element.text();

        $('h4').remove();
        const editedRofl = elementText.replaceAll('— ', `
— `).replaceAll('– ', `
– `);

        rofls.push(editedRofl);
    });

    return rofls;
};

const chooseRoflToSend = (rofls) => {
    const randomNumber = Math.floor(Math.random() * rofls.length);
    return rofls[randomNumber];
}

const rofl = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const pageMarkup = await getPageWithRoflsMarkup();
    const rofls = formRoflsArray(pageMarkup);
    const roflToSend = chooseRoflToSend(rofls);

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, roflToSend, { parse_mode: 'Markdown' });
}

module.exports = rofl;