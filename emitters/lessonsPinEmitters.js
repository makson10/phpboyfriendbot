const bot = require("@/bot");
const shouldHandleMessage = require('@/functions/handleFunction/shouldHandleMessage');
const { isMessageFromGroup } = require('@/functions/handleFunction/checkPermissions');
const { handleLessonSchedule, addLinksToSchedule, checkIfAddedNewLessons } = require('@functions/lessonsPin');

bot.onText(/^\Уроки на /, async (msg) => {
    if (shouldHandleMessage(msg)) await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (shouldHandleMessage(msg)) await addLinksToSchedule(msg);
});

bot.on('edited_message', async (msg) => {
    if (isMessageFromGroup(msg)) await checkIfAddedNewLessons(msg);
});