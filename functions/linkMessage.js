const bot = require('../bot');
const addNewLinkAnswers = require('../assets/addNewLinkAnswers');
const axios = require('axios').default;
const fs = require('fs/promises');

async function setupLinkMessage(msg) {
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

    await axios.post(
        process.env.MEDIATOR_BASE_URL + '/api/vars/setLinkMessage',
        { linkMessageId: messageId + 1 }
    );


    const existHW = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data);

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
        parse_mode: "HTML",
    });
}

async function addNewLink(msg, command = true) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const replyMessage = msg.reply_to_message;
    const messageText = msg.text;
    let messageParameter = messageText.replace('/add_new_link', '').trim();
    let lessonName = "Без названия";

    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    if (!command) {
        lessonName = messageText.slice(0, 30);

        const linksWithSameName = await hwLinks.map(link => {
            if (link.lessonName.includes(lessonName)) return link;
        }).filter(elem => elem !== undefined);

        if (linksWithSameName.length) lessonName += '_' + (linksWithSameName.length + 1);

        const link = `https://t.me/c/${chatId}/${messageId}`;

        const hw = {
            lessonName: lessonName,
            link: link,
        };

        await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw', hw);

        const randomBotAnswerIndex = Math.floor(Math.random() * addNewLinkAnswers.length);
        const botAnswer = addNewLinkAnswers[randomBotAnswerIndex];

        await bot.sendMessage(chatId, botAnswer);

        return;
    }

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

    if (replyMessage.hasOwnProperty("caption")) {
        const lines = replyMessage['caption'].split("\n");
        lessonName = lines[0];
    } else if (replyMessage.hasOwnProperty("document")) {
        lessonName = replyMessage.document.file_name;
    } else if (replyMessage.hasOwnProperty("text")) {
        const lines = replyMessage["text"].split("\n");
        lessonName = lines[0];
    }

    if (messageParameter !== '') lessonName = messageParameter;
    lessonName = lessonName.slice(0, 30);

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

    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw', hw);

    const randomBotAnswerIndex = Math.floor(Math.random() * addNewLinkAnswers.length);
    const botAnswer = addNewLinkAnswers[randomBotAnswerIndex];

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, botAnswer);
    await renderLinkMessage(chatId);
}

async function renderLinkMessage(chatId) {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    let editedText = `Ссылки на дз:\n`;
    await hwLinks.map((hw) => {
        editedText = editedText.concat(`-------------------\n`);
        editedText = editedText.concat(
            `<a href="${hw.link}">${hw.lessonName}</a>\n`
        );
    });

    const linkMessageId = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/vars')
        .then(res => res.data[0]["vars"]["LINK_MESSAGE_ID"]);

    if (!linkMessageId) {
        console.log("LINK_MESSAGE_ID is not exist now");
        return;
    }

    await bot.editMessageText(editedText, {
        parse_mode: "HTML",
        chat_id: chatId,
        message_id: linkMessageId,
    });
}

async function deleteLink(msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    if (!hwLinks.length) {
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

    inlineKeyboard.inline_keyboard.push([
        {
            text: '❌',
            callback_data: 'cancel',
        },
    ]);

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, "Выберите какую ссылку хотите удалить", {
        reply_markup: inlineKeyboard,
    });
}

async function callbackDeleteLink(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const choosenOption = callbackQuery.data;

    if (choosenOption === "allLinkDeleteYes" || choosenOption === "allLinkDeleteNo") return;
    if (choosenOption === 'cancel') {
        return await bot.deleteMessage(chatId, messageId);
    }


    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    const deletedLink = hwLinks.find(link => link.lessonName === choosenOption);

    await fs.writeFile('./assets/lastDeletedLink.json', JSON.stringify(deletedLink));

    if (hwLinks.length === 1) {
        await axios.post(process.env.MEDIATOR_BASE_URL + '/hw/remove/all');
    } else {
        await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw/remove', { lessonName: choosenOption });
    }

    await bot.deleteMessage(chatId, messageId);
    await renderLinkMessage(chatId);
}

async function returnLastHWLink(msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const data = await fs.readFile('./assets/lastDeletedLink.json', 'utf-8') || '{}';
    const deletedLink = await JSON.parse(data);

    if (!deletedLink.lessonName) {
        await bot.deleteMessage(chatId, messageId);
        await bot.sendMessage(chatId, 'У меня пока что нету последнего удаленного сообщения, чтоб его вернуть(');
        return;
    }

    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw', deletedLink);

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, 'Последнее удаленное сообщение вернулось в строй');
    await renderLinkMessage(chatId);
}

async function deleteAllLink(msg) {
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

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, "Вы уверены, что хотите удалить все ссылки?", {
        reply_markup: inlineKeyboard,
    });
    await renderLinkMessage(chatId);
}

async function callbackDeleteAllLink(callbackQuery) {
    const userChoise = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;

    if (userChoise === "allLinkDeleteYes") {
        await bot.deleteMessage(chatId, messageId);
        await axios.post("http://mediator-topaz.vercel.app/api/hw/remove/all");
    } else if (userChoise === "allLinkDeleteNo") {
        await bot.deleteMessage(chatId, messageId);
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
