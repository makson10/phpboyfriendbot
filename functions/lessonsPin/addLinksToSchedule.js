const bot = require('@/bot');
const axios = require('axios').default;

const addLinksToSchedule = async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const links = formLinksToSend(text);
    await sendNewLinksToServer(links);
    await bot.sendMessage(chatId, "Ссылки на уроки были добавлены!");
}

const formLinksToSend = (text) => {
    const lines = text.split("\n");
    const lessons = lines.slice(1);

    const splitedLinks = lessons.map((lesson) => {
        return lesson.split(" - ");
    });

    return splitedLinks;
}

const sendNewLinksToServer = async (newLinks) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/lessons/addLinks', { lessonLinks: newLinks });
}

module.exports = addLinksToSchedule;