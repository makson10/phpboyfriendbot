const bot = require('@/bot');
const { getLessonSchedule, getLessonsLinks } = require('../handleFunction/dbRequestFunctions');
const renderScheduleMessage = require('./renderScheduleMessage');
const axios = require('axios').default;

let newLinks;
const defaultMessageText = "Настройте новые ссылки:";
const keyboard = {
    inline_keyboard: [
        [
            {
                text: "❌",
                callback_data: "addLinks_cancel",
            },
            {
                text: "⭕",
                callback_data: "addLinks_deleteAllLinks",
            },
            {
                text: "✅",
                callback_data: "addLinks_accept",
            },
        ]
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
};

let messagesAfterAddNewLinksMessage = 0;
let callbackUserChoise;
let addLinksMessageChatId;
let addLinksMessageId;


const formKeyboardForDefaultMessage = async () => {
    const lessons = await getLessonSchedule();
    newLinks = await getLessonsLinks();

    for (let i = 0; i < lessons.length; i++) {
        const linkIndex = lessons.length - i;
        const currentLesson = lessons[linkIndex - 1];

        const isLinkForThisLessonExist = !!currentLesson.link;
        const textSufix = isLinkForThisLessonExist ? ' ✅' : '';

        const text = currentLesson.title + textSufix;
        const callback_data = 'addLinks_link' + linkIndex;

        keyboard.inline_keyboard.unshift(
            [
                { text, callback_data }
            ]
        );
    }
}

const updateButtonTextSufix = async () => {
    keyboard.inline_keyboard = keyboard.inline_keyboard.map((button, index) => {
        if (index === keyboard.inline_keyboard.length - 1) return button;

        let buttonText = button[0].text;
        let buttonCallbackData = button[0].callback_data;

        if (!newLinks[index]) {
            if (/ 🆕/.test(buttonText)) {
                buttonText = buttonText.replace(' 🆕', '');
            }

            return [{ text: buttonText, callback_data: buttonCallbackData }];
        }

        const newButtonText = / ✅/.test(buttonText)
            ? buttonText.replace(' ✅', ' 🆕')
            : (/ 🆕/.test(buttonText) ? buttonText : buttonText + ' 🆕');

        const newButton = [
            {
                text: newButtonText, callback_data: buttonCallbackData
            }
        ];

        return newButton;
    });
}

const editMessageToDefaultState = async (chatId, messageId) => {
    await updateButtonTextSufix();

    await bot.editMessageText(
        defaultMessageText,
        { chat_id: chatId, message_id: messageId }
    );

    await bot.editMessageReplyMarkup(
        keyboard,
        { chat_id: chatId, message_id: messageId }
    );
}

const handleMessageWithLink = async (msg) => {
    if (msg.message_id !== addLinksMessageId + messagesAfterAddNewLinksMessage + 1) return;

    const linkIndex = +callbackUserChoise.replace('addLinks_link', '');
    newLinks[linkIndex - 1] = msg.text;

    await bot.deleteMessage(msg.chat.id, msg.message_id);
    messagesAfterAddNewLinksMessage++;

    await editMessageToDefaultState(addLinksMessageChatId, addLinksMessageId);
    bot.removeListener('message', handleMessageWithLink);
}

const sendNewLinksToServer = async () => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/addLinks', { lessonLinks: newLinks });
}


const resetNewLinks = async () => {
    newLinks = Array.from({ length: keyboard.inline_keyboard.length - 1 }, () => null);
}

const resetKeyboard = async () => {
    const buttonAmount = keyboard.inline_keyboard.length - 1;

    for (let i = 0; i < buttonAmount; i++) {
        keyboard.inline_keyboard.shift();
    }
};

const resetVariables = async () => {
    messagesAfterAddNewLinksMessage = 0;
    callbackUserChoise = null;
    addLinksMessageChatId = null;
    addLinksMessageId = null;
}

const resetAllSettings = async () => {
    await resetNewLinks();
    await resetKeyboard();
    await resetVariables();
};


const callbackAddLinks = async (callbackQuery) => {
    callbackUserChoise = callbackQuery.data;
    addLinksMessageChatId = callbackQuery.message.chat.id;
    addLinksMessageId = callbackQuery.message.message_id;

    if (!callbackUserChoise.match(/addLinks_link/)) return;

    await bot.editMessageText(
        'Отправь ссылку на данный урок',
        { chat_id: addLinksMessageChatId, message_id: addLinksMessageId }
    );

    bot.on('message', handleMessageWithLink);
}

const callbackAcceptNewLinks = async (callbackQuery) => {
    userChoise = callbackQuery.data;
    addLinksMessageChatId = callbackQuery.message.chat.id;
    addLinksMessageId = callbackQuery.message.message_id;

    switch (userChoise) {
        case 'addLinks_cancel':
            await bot.deleteMessage(addLinksMessageChatId, addLinksMessageId);

            await resetAllSettings();
            break;

        case 'addLinks_deleteAllLinks':
            await updateButtonTextSufix();
            await editMessageToDefaultState(addLinksMessageChatId, addLinksMessageId);

            await resetNewLinks();
            break;

        case 'addLinks_accept':
            await bot.deleteMessage(addLinksMessageChatId, addLinksMessageId);

            await sendNewLinksToServer();
            await bot.sendMessage(addLinksMessageChatId, 'Ссылки на уроки были добавлены!');
            await renderScheduleMessage(newLinks);

            await resetAllSettings();
            break;

        default:
            break;
    }
}


const addLinksToSchedule = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    await formKeyboardForDefaultMessage();

    await bot.deleteMessage(chatId, messageId);
    const newLinksMessage = await bot.sendMessage(chatId, defaultMessageText, {
        reply_markup: keyboard,
    });

    addLinksMessageChatId = newLinksMessage.chat.id;
    addLinksMessageId = newLinksMessage.message_id;
}

module.exports = { addLinksToSchedule, callbackAddLinks, callbackAcceptNewLinks };