const bot = require("@/bot");
const automaticMessagePinRegex = require('@assets/messageRegex');
const { isMessageFromGroup, isMessageFromSuperAdmin } = require('@/functions/handleFunction/checkPermissions');
const {
    checkShouldCreateNewLinkMessage,
    setupNewLinkMessage,
    addNewLink,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLinks,
    callbackDeleteAllLink,
    getTestAnswers,
    renderLinkMessage,
} = require('@functions/linkMessage');

bot.on('message', async (msg) => {
    if (isMessageFromGroup(msg)) await checkShouldCreateNewLinkMessage(msg);
});

bot.onText(automaticMessagePinRegex, async (msg) => {
    if (isMessageFromGroup(msg)) await addNewLink(msg, false);
});

bot.on('photo', async (msg) => {
    if (isMessageFromGroup(msg) && automaticMessagePinRegex.test(msg.caption)) await addNewLink(msg, false);
});

bot.on('document', async (msg) => {
    if (isMessageFromGroup(msg) && automaticMessagePinRegex.test(msg.caption)) await addNewLink(msg, false);
});

bot.onText(/^\/setup_new_link_message/, async (msg) => {
    if (isMessageFromGroup(msg) && isMessageFromSuperAdmin(msg)) await setupNewLinkMessage(msg);
});

bot.onText(/^\/add_new_link/, async (msg) => {
    if (isMessageFromGroup(msg)) await addNewLink(msg);
});

bot.onText(/^\/delete_link/, async (msg) => {
    if (isMessageFromGroup(msg)) await deleteLink(msg);
});

bot.onText(/^\/return_last_hw_link/, async (msg) => {
    if (!isMessageFromGroup(msg)) return;

    await returnLastHWLink(msg);
    await renderLinkMessage();
});

bot.onText(/^\/delete_all_links/, async (msg) => {
    if (isMessageFromGroup(msg)) await deleteAllLinks(msg);
});

bot.on("callback_query", async (callbackQuery) => {
    await callbackDeleteLink(callbackQuery);
    await callbackDeleteAllLink(callbackQuery);
});

bot.onText(/^(?!.*\bget_test_answers\b)(?=.*\bnaurok\b)(?=.*\bcomplete\b).*/, async (msg) => {
    await getTestAnswers(msg, msg.text, false);
});

bot.onText(/^\/get_test_answers (.+)/, async (msg, match) => {
    await getTestAnswers(msg, match[1]);
});
