require('module-alias/register');
require("dotenv").config();
const bot = require('./bot');
const automaticMessagePinRegex = require('@assets/messageRegex');
const { isMessageFromGroup } = require('@functions/checkPermissions');
const { rofl, meme, shock, say, sendStikerAfterGetHW, spam } = require('@functions/simpleFunctions');
const { handleLessonSchedule, addLinksToSchedule } = require('@functions/lessonsPin');
const {
    setupLinkMessage,
    addNewLink,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLinks,
    callbackDeleteAllLink
} = require('@functions/linkMessage');
const shouldHandleMessage = require('@functions/shouldHandleMessage');

//? --------------------------------------

bot.on('error', (error) => console.log(error));

bot.on('polling_error', (error) => console.log(error));

bot.on('webhook_error', (error) => console.log(error));

//? --------------------------------------

bot.onText(/^\/rofl/, (msg) => rofl(msg));

bot.onText(/^\/meme/, (msg) => meme(msg));

bot.onText(/^\/shock/, (msg) => shock(msg));

bot.onText(/^\/say (.+)/gms, (msg, match) => say(msg, match));
``
//? --------------------------------------

bot.onText(/^\/spam (.+)/, (msg, match) => spam(msg, match));

bot.on("document", (msg) => sendStikerAfterGetHW(msg));

//? --------------------------------------

bot.onText(/^\Уроки на /, async (msg) => {
    if (!shouldHandleMessage(msg)) return;
    await handleLessonSchedule(msg);
});

bot.onText(/^\/add_links/, async (msg) => {
    if (!shouldHandleMessage(msg)) return;
    await addLinksToSchedule(msg);
});

//? --------------------------------------

bot.onText(automaticMessagePinRegex, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await addNewLink(msg, false);
});

bot.onText(/^\/setup_new_link_message/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await setupLinkMessage(msg);
});

bot.onText(/^\/add_new_link/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await addNewLink(msg);
});

bot.onText(/^\/delete_link/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await deleteLink(msg);
});

bot.onText(/^\/return_last_hw_link/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await returnLastHWLink(msg);
});

bot.onText(/^\/delete_all_links/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await deleteAllLinks(msg);
});

bot.on("callback_query", async (callbackQuery) => {
    await callbackDeleteLink(callbackQuery);
    await callbackDeleteAllLink(callbackQuery);
});

//? --------------------------------------

//* For Prod:
// app.listen(3000, () => {
//     console.log('Server stated on 3000 port');
// });
