const bot = require("@/bot");
const { getSupergroupId } = require('@/functions/handleFunction/dbRequestFunctions');
const handleLessonSchedule = require("./handleLessonSchedule");
const getScheduleMessage = require("./getScheduleMessage");
const { default: axios } = require("axios");
const { renderLinkMessage } = require("../linkMessage");

const todayDate = new Date();
const todayHours = todayDate.getHours();
const todayDay = todayDate.getDay();

const deleteOldHw = async () => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/hw/removeOldHwLinks');

    setTimeout(async () => {
        await renderLinkMessage();
    }, 3000);
}

const sendScheduleMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const supergroupId = await getSupergroupId();
    await bot.deleteMessage(chatId, messageId);

    if (todayDay === 5 || (todayDay === 6 && todayHours < 20)) {
        await bot.sendMessage(chatId, 'Завтра выходной братик, отдыхай');
        return;
    }

    const scheduleMessages = getScheduleMessage([]);
    //* For dev testing:
    // const newScheduleMessage = await bot.sendMessage(chatId, scheduleMessages, { parse_mode: 'HTML' });
    const newScheduleMessage = await bot.sendMessage(supergroupId, scheduleMessages, { parse_mode: 'HTML' });
    await handleLessonSchedule(newScheduleMessage);

    // if (todayHours >= 22 || todayHours === 0 || todayHours === 1) await deleteOldHw();
    await deleteOldHw();
}

module.exports = sendScheduleMessage;