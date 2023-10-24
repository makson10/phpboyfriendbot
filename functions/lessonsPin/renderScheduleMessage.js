const bot = require("@/bot");
const scheduleMessages = require("@/assets/scheduleMessages");
const { getScheduleMessageId, getSupergroupId } = require("../handleFunction/dbRequestFunctions");

const getScheduleDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const nextDate = new Date(currentDate);
    if (currentHour >= 15) nextDate.setDate(currentDate.getDate() + 1);
    return nextDate;
}

const getScheduleMessage = (links) => {
    const scheduleDate = new Date(getScheduleDate());

    const dayOfWeek = scheduleDate.getDay() - 1;
    const fullDate = scheduleDate.getDate().toString() + '.' + (scheduleDate.getMonth() + 1);

    return scheduleMessages[dayOfWeek](fullDate, links);
}

const renderScheduleMessage = async (links) => {
    const supergroupId = await getSupergroupId();
    const scheduleMessageId = await getScheduleMessageId();

    const newScheduleMessages = getScheduleMessage(links);
    await bot.editMessageText(
        newScheduleMessages,
        {
            chat_id: supergroupId,
            message_id: scheduleMessageId,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        }
    );
}

module.exports = { renderScheduleMessage, getScheduleMessage };