const bot = require("@/bot");
const scheduleMessages = require("@/assets/scheduleMessages");
const { getVars } = require('@/functions/handleFunction/dbRequestFunctions');
const handleLessonSchedule = require("./handleLessonSchedule");

const getGroupId = async () => {
    const vars = await getVars();
    return '-100' + vars['supergroup_chat_id'];
}

const getTomorrowDate = () => {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    return nextDate;
}

const getScheduleMessage = (tomorrowDate) => {
    const scheduleMessageDate = new Date(tomorrowDate);
    const dayOfWeek = scheduleMessageDate.getDay() - 1;
    const fullDate = scheduleMessageDate.getDate().toString() + '.' + (scheduleMessageDate.getMonth() + 1);

    return scheduleMessages[dayOfWeek](fullDate);
}

const sendScheduleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const groupId = await getGroupId();
    const tomorrowDate = getTomorrowDate();
    const scheduleMessages = getScheduleMessage(tomorrowDate);

    await bot.deleteMessage(chatId, messageId);
    const newScheduleMessage = await bot.sendMessage(groupId, scheduleMessages, { parse_mode: 'HTML' });
    handleLessonSchedule(newScheduleMessage);
}

module.exports = sendScheduleMessage;