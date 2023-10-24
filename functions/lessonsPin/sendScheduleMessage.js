const bot = require("@/bot");
const { getSupergroupId } = require('@/functions/handleFunction/dbRequestFunctions');
const handleLessonSchedule = require("./handleLessonSchedule");
const { getScheduleMessage } = require("./renderScheduleMessage");

const sendScheduleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const supergroupId = await getSupergroupId();
    const scheduleMessages = getScheduleMessage([]);

    await bot.deleteMessage(chatId, messageId);
    // const newScheduleMessage = await bot.sendMessage(chatId, scheduleMessages, { parse_mode: 'HTML' });
    const newScheduleMessage = await bot.sendMessage(supergroupId, scheduleMessages, { parse_mode: 'HTML' });
    await handleLessonSchedule(newScheduleMessage);
}

module.exports = sendScheduleMessage;