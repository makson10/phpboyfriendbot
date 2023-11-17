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

const sendScheduleMessage = async (msg, wasInvokedFromCommand = true) => {
    const todayDate = new Date();
    const todayDay = todayDate.getUTCDay();
    const todayHours = todayDate.getUTCHours();

    if (wasInvokedFromCommand) await bot.deleteMessage(msg.chat.id, msg.message_id);

    if (todayDay === 6 || (todayDay === 0 && todayHours < 20)) {
        if (wasInvokedFromCommand) await bot.sendMessage(msg.chat.id, 'Завтра выходной братик, отдыхай');
        return;
    }

    const supergroupId = await getSupergroupId();
    const scheduleMessages = getScheduleMessage([]);
    const newScheduleMessage = await bot.sendMessage(supergroupId, scheduleMessages, { parse_mode: 'HTML' });
    await handleLessonSchedule(newScheduleMessage);

    if (todayHours >= 20) await deleteOldHw();
}

module.exports = sendScheduleMessage;