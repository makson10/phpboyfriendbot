const bot = require('@/bot');
const axios = require('axios').default;

const getHwLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    return hwLinks;
};

const checkIsHwLinkExist = (hwLinks) => {
    if (!hwLinks.length) {
        bot.sendMessage(chatId, "Нету сохраненных ссылок, не в этот раз");
        bot.deleteMessage(chatId, messageId);
    } else return true;
};

const formDeleteMessageKeyboard = async (hwLinks) => {
    const keyboard = {
        inline_keyboard: [],
        resize_keyboard: true,
        one_time_keyboard: true,
    };

    await hwLinks.map((hw) => {
        const lessonTitle = hw.lessonTitle;
        keyboard.inline_keyboard.push([
            {
                text: lessonTitle,
                callback_data: lessonTitle,
            },
        ]);
    });

    keyboard.inline_keyboard.push([
        {
            text: '❌',
            callback_data: 'cancel',
        },
    ]);

    return keyboard;
};

const sendDeleteMessage = async (chatId, messageId, keyboard) => {
    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, "Выберите какую ссылку хотите удалить", {
        reply_markup: keyboard,
    });
};

const deleteLink = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const hwLinks = await getHwLinks();
    if (!checkIsHwLinkExist(hwLinks)) return;

    const keyboard = await formDeleteMessageKeyboard(hwLinks);
    await sendDeleteMessage(chatId, messageId, keyboard);
}

module.exports = deleteLink;