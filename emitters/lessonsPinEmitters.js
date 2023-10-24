const bot = require("@/bot");
const shouldHandleMessage = require('@/functions/handleFunction/shouldHandleMessage');
const { isMessageFromGroup } = require('@/functions/handleFunction/checkPermissions');
const {
    handleLessonSchedule,
    addLinksToSchedule,
    checkIfAddedNewLessons,
    callbackAddLinks,
    callbackAcceptNewLinks,
    sendScheduleMessage,
    renderScheduleMessage,
} = require('@functions/lessonsPin');
const { getLessonsLinks } = require("@/functions/handleFunction/dbRequestFunctions");

bot.onText(/^\Уроки на /, async (msg) => {
    if (shouldHandleMessage(msg)) await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (shouldHandleMessage(msg)) await addLinksToSchedule(msg);
});

bot.onText(/^\/send_schedule_message/, async (msg) => {
    if (shouldHandleMessage(msg)) await sendScheduleMessage(msg);
});

bot.onText(/^\/render_schedule_message/gms, async (msg) => {
    if (shouldHandleMessage(msg)) {
        const links = await getLessonsLinks();
        await renderScheduleMessage(links);
        await bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.on('edited_message', async (msg) => {
    if (isMessageFromGroup(msg)) await checkIfAddedNewLessons(msg);
});

bot.on('callback_query', async (callbackQuery) => {
    await callbackAddLinks(callbackQuery);
    await callbackAcceptNewLinks(callbackQuery);
});