const bot = require("@/bot");
const automaticMessagePinRegex = require('@assets/messageRegex');
const { isMessageFromGroup } = require('@functions/checkPermissions');
const {
    checkShouldCreateNewLinkMessage,
    setupNewLinkMessage,
    addNewLink,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLinks,
    callbackDeleteAllLink
} = require('@functions/linkMessage');

bot.on('message', async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await checkShouldCreateNewLinkMessage(msg);
});

bot.onText(automaticMessagePinRegex, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await addNewLink(msg, false);
});

bot.onText(/^\/setup_new_link_message/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;
    await setupNewLinkMessage(msg);
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