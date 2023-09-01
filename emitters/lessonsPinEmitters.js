const bot = require("@/bot");
const shouldHandleMessage = require('@/functions/handleFunction/shouldHandleMessage');
const { handleLessonSchedule, addLinksToSchedule } = require('@functions/lessonsPin');

bot.onText(/^\Уроки на /, async (msg) => {
    if (shouldHandleMessage(msg)) await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (shouldHandleMessage(msg)) await addLinksToSchedule(msg);
});