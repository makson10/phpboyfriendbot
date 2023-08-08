const bot = require('@/bot');

const formDeleteMessageKeyboard = () => {
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: "Да",
                    callback_data: "allLinkDeleteYes",
                },
                {
                    text: "Нет",
                    callback_data: "allLinkDeleteNo",
                },
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    };

    return keyboard;
};

const sendDeleteMessage = async (chatId, messageId, keyboard) => {
    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, "Вы уверены, что хотите удалить все ссылки?", {
        reply_markup: keyboard,
    });
};

const deleteAllLinks = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const keyboard = formDeleteMessageKeyboard();
    await sendDeleteMessage(chatId, messageId, keyboard);
}

module.exports = deleteAllLinks;