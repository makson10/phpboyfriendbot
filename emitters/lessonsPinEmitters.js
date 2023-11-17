const bot = require("@/bot");
const shouldHandleMessage = require('@/functions/handleFunction/shouldHandleMessage');
const { isMessageFromGroup, isMessageFromSuperAdmin } = require('@/functions/handleFunction/checkPermissions');
const {
    handleLessonSchedule,
    addLinksToSchedule,
    checkIfAddedNewLessons,
    callbackAddLinks,
    callbackAcceptNewLinks,
    sendScheduleMessage,
    renderScheduleMessage,
    removeLessonFromMessage,
    addLessonToMessage,
    callbackRemoveLesson,
} = require('@functions/lessonsPin');

bot.onText(/^\Уроки на /, async (msg) => {
    if (shouldHandleMessage(msg)) await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (isMessageFromSuperAdmin(msg)) await addLinksToSchedule(msg);
});

bot.onText(/^\/send_schedule_message/, async (msg) => {
    if (shouldHandleMessage(msg)) await sendScheduleMessage(msg);
});

bot.onText(/^\/render_schedule_message/gms, async (msg) => {
    if (shouldHandleMessage(msg)) {
        await renderScheduleMessage();
        await bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});

bot.onText(/^\/remove_lesson/, async (msg) => {
    if (shouldHandleMessage(msg)) await removeLessonFromMessage(msg);
});

bot.onText(/^\/add_lesson (.+)/, async (msg, match) => {
    if (shouldHandleMessage(msg)) await addLessonToMessage(msg, match[1]);
});

bot.on('edited_message', async (msg) => {
    if (isMessageFromGroup(msg)) await checkIfAddedNewLessons(msg);
});

bot.on('callback_query', async (callbackQuery) => {
    await callbackAddLinks(callbackQuery);
    await callbackAcceptNewLinks(callbackQuery);
    await callbackRemoveLesson(callbackQuery);
});