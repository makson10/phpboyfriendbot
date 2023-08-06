require("dotenv").config();
const bot = require('./bot');
const automaticMessagePinRegex = require('./assets/messageRegex');
const { isMessageFromGroup, isMessageFromSuperAdmin } = require('./functions/checkPermissions');
const { rofl, meme, shock, say, getDocument, spam } = require('./functions/simpleFunctions');
const { handleLessonSchedule, addLinksToSchedule } = require('./functions/lessonsPin');
const {
    setupLinkMessage,
    addNewLink,
    renderLinkMessage,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLink,
    callbackDeleteAllLink
} = require('./functions/linkMessage');

//? --------------------------------------

bot.onText(/^\/rofl/, (msg) => rofl(bot, msg));

bot.onText(/^\/meme/, (msg) => meme(bot, msg));

bot.onText(/^\/shock/, (msg) => shock(bot, msg));

bot.onText(/^\/say (.+)/gms, (msg, match) => say(bot, msg, match));
``
//? --------------------------------------

bot.onText(/^\/spam (.+)/, (msg, match) => spam(bot, msg, match));

bot.on("document", (msg) => getDocument(bot, msg));

bot.onText(automaticMessagePinRegex, async (msg) => {
    if (isMessageFromGroup(msg)) return;

    const chatId = msg.chat.id;
    await addNewLink(bot, msg, false);
    await renderLinkMessage(bot, chatId);
});

//? --------------------------------------

bot.onText(/^\Уроки на /, (msg) => {
    if (!isMessageFromGroup(msg) && !isMessageFromSuperAdmin(msg)) {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
        );

        return;
    }

    handleLessonSchedule(bot, msg);
});

bot.onText(/^\/add_links/, (msg) => {
    if (!isMessageFromGroup(msg) && !isMessageFromSuperAdmin(msg)) {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
        );

        return;
    }

    addLinksToSchedule(bot, msg);
});

//? --------------------------------------

bot.onText(/^\/setup_new_link_message/, async (msg) => {
    if (isMessageFromGroup(msg)) return;

    await setupLinkMessage(bot, msg);
});

bot.onText(/^\/add_new_link/, async (msg) => {
    if (isMessageFromGroup(msg)) return;

    const chatId = msg.chat.id;
    await addNewLink(bot, msg);
    await renderLinkMessage(bot, chatId);
});

//* For dev:
bot.onText(/^\/render_link_message/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    await renderLinkMessage(bot, chatId);
    await bot.deleteMessage(chatId, messageId);
});

bot.onText(/^\/delete_link/, async (msg) => {
    if (isMessageFromGroup(msg)) return;

    await deleteLink(bot, msg);
});

bot.onText(/^\/return_last_hw_link/, async (msg) => {
    if (isMessageFromGroup(msg)) return;
    const chatId = msg.chat.id;

    await returnLastHWLink(bot, msg);
    await renderLinkMessage(bot, chatId);
});

bot.onText(/^\/delete_all_links/, async (msg) => {
    if (isMessageFromGroup(msg)) return;

    await deleteAllLink(bot, msg);
    await renderLinkMessage(bot, chatId);
});

bot.on("callback_query", async (callbackQuery) => {
    await callbackDeleteAllLink(bot, callbackQuery);
    await callbackDeleteLink(bot, callbackQuery);
});

//? --------------------------------------

//* For Prod:
// app.listen(3000, () => {
//     console.log('Server stated on 3000 port');
// });
