const bot = require('@/bot');
const axios = require('axios').default;

const formLinksToSend = (linksList) => {
    const links = linksList.split('\n');

    const splitedLinks = links.map((link) => {
        if (link.slice(0, 3) === 'http') {
            return link;
        }

        return link.split(" - ");
    });
    
    return splitedLinks;
}

const sendNewLinksToServer = async (newLinks) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/addLinks', { lessonLinks: newLinks });
}

const addLinksToSchedule = async (msg) => {
    const chatId = msg.chat.id;
    const linksList = msg.text.replace('/add_links', '').trim();

    const links = formLinksToSend(linksList);
    await sendNewLinksToServer(links);
    await bot.sendMessage(chatId, "Ссылки на уроки были добавлены!");
}

module.exports = addLinksToSchedule;