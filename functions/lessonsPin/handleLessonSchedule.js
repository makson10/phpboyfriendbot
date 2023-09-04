const bot = require('@/bot');
const axios = require('axios').default;

const pinLessonScheduleMessage = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    bot.pinChatMessage(chatId, messageId, { disable_notification: true });
}

const formScheduleToSend = (text) => {
    const schedule = {};

    const lines = text.split("\n");
    schedule.dayTitle = lines[0];

    const lessons = lines.slice(1);
    const splitedLessons = lessons.map((lesson) => {
        return lesson.split(" - ");
    });

    schedule.lessons = splitedLessons.map((lesson) => {
        const timeData = lesson[0].split(":");

        const firstLessonTitleLetter = lesson[1].slice(0, 1).toUpperCase();
        const restLessonTitle = lesson[1].slice(1);
        const lessonTitle = `${firstLessonTitleLetter}${restLessonTitle}`;

        const newLesson = {
            time: {
                hour: timeData[0],
                minute: timeData[1]
            },
            title: lessonTitle,
            link: null,
        };

        return newLesson;
    });

    return schedule;
}

const sendScheduleToServer = async (newLessonSchedule) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/updateLessons', newLessonSchedule);
}

const updateLessonScheduleMessageId = async (messageId) => {
    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/vars/updateLessonScheduleMessageId',
        { newLessonScheduleMessageId: messageId }
    );
}

const handleLessonSchedule = async (msg) => {
    const messageId = msg.message_id;
    const messageText = msg.text;

    pinLessonScheduleMessage(msg);
    const schedule = formScheduleToSend(messageText);
    sendScheduleToServer(schedule);
    updateLessonScheduleMessageId(messageId);
}

module.exports = handleLessonSchedule;