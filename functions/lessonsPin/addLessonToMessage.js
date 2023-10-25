const bot = require("@/bot");
const { default: axios } = require("axios");
const renderScheduleMessage = require("./renderScheduleMessage");

const sendAddLessonRequest = async (newLesson) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/addLesson', { newLesson });
};

const addLessonToMessage = async (msg, newLessonDataString) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const dataFromMessage = newLessonDataString.split(' - ');
    const lessonTime = dataFromMessage[0].split(':');

    const newLesson = {
        time: {
            hour: lessonTime[0],
            minute: lessonTime[1],
        },
        title: dataFromMessage[1],
        link: null,
    }

    await sendAddLessonRequest(newLesson);
    await renderScheduleMessage();

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, 'Блин, ещё один урок был добавлен в расписание');
}

module.exports = addLessonToMessage;