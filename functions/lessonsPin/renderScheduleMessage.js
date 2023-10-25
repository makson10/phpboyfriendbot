const bot = require("@/bot");
const { getScheduleMessageId, getSupergroupId, getLessonSchedule, getLessonsLinks, getScheduleTitle } = require("../handleFunction/dbRequestFunctions");

const formScheduleMessageFromData = (dayTitle, scheduleData) => {
    let newScheduleMessage = dayTitle + '\n';

    scheduleData.map((lesson) => {
        const time = lesson.time.hour + ':' + lesson.time.minute;
        const title = '<a href="' + lesson.link + '">' + lesson.title + '</a>'

        newScheduleMessage += time + ' - ' + title + '\n';
    });

    return newScheduleMessage;
}

const renderScheduleMessage = async () => {
    const supergroupId = await getSupergroupId();
    const scheduleMessageId = await getScheduleMessageId();

    const dayTitle = await getScheduleTitle();
    const scheduleData = await getLessonSchedule();

    const newScheduleMessages = formScheduleMessageFromData(dayTitle, scheduleData);

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

module.exports = renderScheduleMessage;