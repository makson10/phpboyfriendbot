const bot = require("@/bot");
const { getLessonSchedule } = require("../handleFunction/dbRequestFunctions");

const formRemoveLessonKeyboard = async (lessons) => {
    const keyboard = {
        inline_keyboard: [],
        resize_keyboard: true,
        one_time_keyboard: true,
    };

    await lessons.map((lesson) => {
        keyboard.inline_keyboard.push([
            {
                text: lesson.title,
                callback_data: 'removeLesson_' + lesson.title,
            },
        ]);
    });

    keyboard.inline_keyboard.push([
        {
            text: '❌',
            callback_data: 'removeLesson_cancel',
        },
    ]);

    return keyboard;
}

const removeLessonFromMessage = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const lessons = await getLessonSchedule();
    const keyboard = await formRemoveLessonKeyboard(lessons);

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, 'Выбери урок, который нужно удалить:', { reply_markup: keyboard });
}

module.exports = removeLessonFromMessage;