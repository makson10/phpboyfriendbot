const bot = require("@/bot");
const { getSupergroupId } = require('@/functions/handleFunction/dbRequestFunctions');
const handleLessonSchedule = require("./handleLessonSchedule");
const getScheduleMessage = require("./getScheduleMessage");
const { default: axios } = require("axios");
const { renderLinkMessage } = require("../linkMessage");

const deleteOldHw = async () => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/hw/removeOldHwLinks');
    await renderLinkMessage();
}

const sendScheduleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const todayDate = new Date();
    const todayHours = todayDate.getUTCHours();
    const todayDay = todayDate.getUTCDay();

    const supergroupId = await getSupergroupId();
    await bot.deleteMessage(chatId, messageId);

    if (todayDay === 5 || (todayDay === 6 && todayHours < 20)) {
        await bot.sendMessage(chatId, 'Завтра выходной братик, отдыхай');
        return;
    }

    const scheduleMessages = getScheduleMessage([]);
    const newScheduleMessage = await bot.sendMessage(supergroupId, scheduleMessages, { parse_mode: 'HTML' });
    await handleLessonSchedule(newScheduleMessage);

    if (todayHours >= 20) await deleteOldHw();
}

module.exports = sendScheduleMessage;