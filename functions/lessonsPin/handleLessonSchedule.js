const bot = require('@/bot');
const { isMessageFromGroup } = require('../handleFunction/checkPermissions');
const { getSupergroupId, getScheduleMessageId } = require('../handleFunction/dbRequestFunctions');
const axios = require('axios').default;

const unpinOldScheduleMessage = async () => {
    try {
        const supergroupId = await getSupergroupId();
        const oldScheduleMessageId = await getScheduleMessageId();

        await bot.unpinChatMessage(supergroupId, { message_id: oldScheduleMessageId, disable_notification: true });
    } catch (error) {
        console.log(error);
    }
}

const pinScheduleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await bot.pinChatMessage(chatId, messageId, { disable_notification: true });
}

const formScheduleToSend = async (text) => {
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

const updateScheduleMessageId = async (messageId) => {
    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/vars/updateLessonScheduleMessageId',
        { newLessonScheduleMessageId: messageId }
    );
}

const handleLessonSchedule = async (msg) => {
    const messageId = msg.message_id;
    const messageText = msg.text;

    const schedule = await formScheduleToSend(messageText);
    await sendScheduleToServer(schedule);

    if (!isMessageFromGroup(msg)) return;
    await unpinOldScheduleMessage();
    await pinScheduleMessage(msg);
    await updateScheduleMessageId(messageId);
}

module.exports = handleLessonSchedule;