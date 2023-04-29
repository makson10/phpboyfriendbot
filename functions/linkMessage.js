const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require('fs/promises');

async function setupLinkMessage(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (msg.from.username !== "Makson_w") {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
        );

        return;
    }

    await fetch("http://mediator-topaz.vercel.app/api/vars/setLinkMessage", {
        method: "POST",
        body: JSON.stringify({ linkMessageId: messageId + 1 }),
        headers: {
            "Content-Type": "application/json",
        },
    });


    const existHW = await fetch("http://mediator-topaz.vercel.app/api/hw").then(
        (data) => data.json()
    );

    const hwLinks = existHW["homeworks"];

    let newLinkMessageText = `Ссылки на дз:\n`;
    await hwLinks.map((hw) => {
        newLinkMessageText = newLinkMessageText.concat(`-------------------\n`);
        newLinkMessageText = newLinkMessageText.concat(
            `<a href="${hw.link}">${hw.lessonName}</a>\n`
        );
    });


    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, newLinkMessageText, {
        disable_notification: true,
    });
}

async function addNewLink(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const replyMessage = msg.reply_to_message;
    const messageText = msg.text;
    let messageParameter = messageText.replace('/add_new_link', '').trim();

    if (!msg.hasOwnProperty("reply_to_message")) {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Ты не указал, что мне нужно сохранить, так что подумай над своим поведением"
        );

        return;
    }

    if (messageParameter.slice(0, 1) === '@') {
        messageParameter = messageParameter.replace('@PHPBoyFriendBot', '').trim();
    }

    let lessonName = "Без названия";

    if (replyMessage.hasOwnProperty("caption")) {
        const lines = replyMessage['caption'].split("\n");
        lessonName = lines[0];

    } else if (replyMessage.hasOwnProperty("document")) {
        lessonName = replyMessage.document.file_name;

    } else if (replyMessage.hasOwnProperty("text")) {
        const lines = replyMessage["text"].split("\n");
        lessonName = lines[0];
    }

    if (messageParameter !== '') {
        lessonName = messageParameter;
    }

    lessonName = lessonName.slice(0, 30);


    const existHW = await fetch("http://mediator-topaz.vercel.app/api/hw").then(
        (data) => data.json()
    );

    const hwLinks = existHW["homeworks"];

    hwLinks.map((hw) => {
        if (hw.lessonName === lessonName) {
            lessonName = lessonName.concat("_2");
        }
    });

    const rawReplyMessageChatId = replyMessage.chat.id.toString();
    const replyMessageId = replyMessage.message_id;

    const replyMessageChatId = +rawReplyMessageChatId.slice(4);
    const link = `https://t.me/c/${replyMessageChatId}/${replyMessageId}`;

    const hw = {
        lessonName: lessonName,
        link: link,
    };

    await fetch("http://mediator-topaz.vercel.app/api/hw", {
        method: "POST",
        body: JSON.stringify(hw),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, "Ссылка сделана, радуйтесь");
}

async function renderLinkMessage(bot, chatId) {
    const existHW = await fetch("http://mediator-topaz.vercel.app/api/hw").then(
        (data) => data.json()
    );

    const hwLinks = existHW["homeworks"];

    let editedText = `Ссылки на дз:\n`;
    await hwLinks.map((hw) => {
        editedText = editedText.concat(`-------------------\n`);
        editedText = editedText.concat(
            `<a href="${hw.link}">${hw.lessonName}</a>\n`
        );
    });

    const varsData = await fetch(
        "http://mediator-topaz.vercel.app/api/vars"
    ).then((data) => data.json());
    const linkMessageId = await varsData[0]["vars"]["LINK_MESSAGE_ID"];

    if (!linkMessageId) {
        console.log("[LINK_MESSAGE_ID] is not exist now");
        return;
    }

    await bot.editMessageText(editedText, {
        parse_mode: "HTML",
        chat_id: chatId,
        message_id: linkMessageId,
    });
}

async function deleteLink(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const existHW = await fetch("http://mediator-topaz.vercel.app/api/hw").then(
        (data) => data.json()
    );

    const hwLinks = await existHW["homeworks"];

    if (hwLinks.length === 0) {
        bot.sendMessage(chatId, "Нету сохраненных ссылок, не в этот раз");
        bot.deleteMessage(chatId, messageId);

        return;
    }

    const inlineKeyboard = {
        inline_keyboard: [],
        resize_keyboard: true,
        one_time_keyboard: true,
    };

    await hwLinks.map((hw) => {
        const lessonName = hw.lessonName;
        inlineKeyboard.inline_keyboard.push([
            {
                text: lessonName,
                callback_data: lessonName,
            },
        ]);
    });

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, "Выберите какую ссылку хотите удалить", {
        reply_markup: inlineKeyboard,
    });
}

async function callbackDeleteLink(bot, callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const lessonName = callbackQuery.data;

    if (
        lessonName === 'allLinkDeleteYes' ||
        lessonName === 'allLinkDeleteNo' ||
        lessonName === 'Extra Gay' ||
        lessonName === 'Youtuber Sanek' ||
        lessonName === 'Elecey'
    ) {
        await bot.deleteMessage(chatId, messageId);
        return;
    }

    const existHW = await fetch("http://mediator-topaz.vercel.app/api/hw").then(
        (data) => data.json()
    );

    const hwLinks = existHW["homeworks"];
    const deletedLink = hwLinks.find(link => link.lessonName === lessonName);

    await fs.writeFile('./assets/lastDeletedLink.json', JSON.stringify(deletedLink));

    if (hwLinks.length === 1) {
        await fetch("http://mediator-topaz.vercel.app/api/hw/remove/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        await fetch("http://mediator-topaz.vercel.app/api/hw/remove", {
            method: "POST",
            body: JSON.stringify({ lessonName: lessonName }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    await bot.deleteMessage(chatId, messageId);
    await renderLinkMessage(bot, chatId);
}

async function returnLastHWLink(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const data = await fs.readFile('./assets/lastDeletedLink.json', 'utf-8') || '{}';
    const deletedLink = await JSON.parse(data);

    if (typeof deletedLink.lessonName !== 'string') {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, 'У меня пока что нету последнего удаленного сообщения, чтоб его вернуть(');
        return;
    }

    await fetch("http://mediator-topaz.vercel.app/api/hw", {
        method: "POST",
        body: JSON.stringify(deletedLink),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, 'Последнее удаленное сообщение вернулось в строй');
}

function deleteAllLink(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const inlineKeyboard = {
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

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, "Вы уверены, что хотите удалить все ссылки?", {
        reply_markup: inlineKeyboard,
    });
}

async function callbackDeleteAllLink(bot, callbackQuery) {
    const userChoise = callbackQuery.data;

    if (userChoise === "allLinkDeleteYes") {
        await fetch("http://mediator-topaz.vercel.app/api/hw/remove/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else if (userChoise === "allLinkDeleteNo") {
        console.log("User chose NO");
    }
}

module.exports = {
    setupLinkMessage,
    addNewLink,
    renderLinkMessage,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLink,
    callbackDeleteAllLink,
};
