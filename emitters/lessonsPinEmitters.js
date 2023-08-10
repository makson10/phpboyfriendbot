const bot = require("@/bot");
const shouldHandleMessage = require('@functions/shouldHandleMessage');
const { handleLessonSchedule, addLinksToSchedule } = require('@functions/lessonsPin');

bot.onText(/^\Уроки на /, async (msg) => {
    if (!shouldHandleMessage(msg)) return;
    await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (!shouldHandleMessage(msg)) return;
    await addLinksToSchedule(msg);
});