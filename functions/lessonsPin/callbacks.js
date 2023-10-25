const bot = require("@/bot");
const { default: axios } = require("axios");
const renderScheduleMessage = require("./renderScheduleMessage");

const sendRemoveLessonRequest = async (lessonTitle) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/removeLesson', { lessonTitle });
};

const callbackRemoveLesson = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const choosenOption = callbackQuery.data;

    if (!choosenOption.match(/removeLesson_/)) return;

    await bot.deleteMessage(chatId, messageId);
    if (choosenOption === 'removeLesson_cancel') return;

    const lessonTitle = choosenOption.replace('removeLesson_', '');
    await sendRemoveLessonRequest(lessonTitle);
    await renderScheduleMessage();
    await bot.sendMessage(chatId, 'Удалил этот урок, туда его');
}

module.exports = { callbackRemoveLesson };