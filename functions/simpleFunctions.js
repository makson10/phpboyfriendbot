const roflArray = require("../assets/rofls");
const memesLink = require("../assets/memesLink");
const answerForUsers = require("../assets/answerForUsersKtoI");
const cheerio = require("cheerio");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


function newFunction() {
    return require("node-fetch");
}

function rofl(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const randomNumber = Math.floor(Math.random() * roflArray.length);
    const randomRofl = roflArray[randomNumber];

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, randomRofl);
}

function meme(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const randomNumber = Math.floor(Math.random() * (memesLink.length - 1) + 1);
    const randomMeme = memesLink[randomNumber];

    bot.deleteMessage(chatId, messageId);
    bot.sendPhoto(chatId, randomMeme);
}

function thisMeme(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    bot.deleteMessage(chatId, messageId);
    bot.sendPhoto(chatId, memesLink[0]);
}

function neUmnichai(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const messageToReply = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    const messageForUmniki = `Нет ничего утомительнее, чем присутствовать при том, как человек демонстрирует свой ум. В особенности, если ума нет.
(С) Эрих Мария Ремарк`;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, messageForUmniki, {
        reply_to_message_id: messageToReply,
    });
}

function ktoI(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const senderUserName = msg.from.username;
    const senderFirstName = msg.from.first_name;

    const messageForUser = answerForUsers[senderUserName];

    const message =
        messageForUser !== undefined
            ? `${senderFirstName} - это ${messageForUser}`
            : answerForUsers["unknown"];

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, message);
}

function shock(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const replyMessageId = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, "Нихуя себе", {
        reply_to_message_id: replyMessageId,
    });
}

function thanks(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const replyMessageId = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    const message = `Ооо, спасибо, ${msg.from.username === "pidoprigora21" ? "любимая" : "любимый"
        } ❤`;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, message, {
        reply_to_message_id: replyMessageId,
    });
}

function say(bot, msg, match) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const messageToSay = match[1];
    const messageToReply = msg.hasOwnProperty("reply_to_message")
        ? msg.reply_to_message.message_id
        : undefined;

    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(chatId, messageToSay, {
        reply_to_message_id: messageToReply
    });
}

async function getDocument(bot, msg) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const stickerPackData = await bot.getStickerSet('NiggersMeme');
    const randomNumber = Math.floor(Math.random() * stickerPackData['stickers'].length);

    bot.sendSticker(chatId, stickerPackData['stickers'][randomNumber]['file_id'], {
        reply_to_message_id: messageId,
    });
}

async function compliment(bot, msg, match) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const recipient = match[1];

    if (recipient.slice(0, 1) !== '@') {
        await bot.deleteMessage(chatId, messageId);
        return;
    }


    const firstSiteMarkup = await fetch('https://pozdravok.com/pozdravleniya/lyubov/komplimenty/', {
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
    })
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const decoder = new TextDecoder('windows-1251', { fatal: true });
            const text = decoder.decode(buffer);
            return text;
        });

    const secondSiteMarkup = await fetch('https://pozdravok.com/pozdravleniya/lyubov/komplimenty/2.htm', {
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
    })
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const decoder = new TextDecoder('windows-1251', { fatal: true });
            const text = decoder.decode(buffer);
            return text;
        });

    const $ = cheerio.load(firstSiteMarkup);
    const $$ = cheerio.load(secondSiteMarkup);
    const allCompliment = [];

    $('.sfst').each((i, elem) => {
        allCompliment.push($(elem).text());
    });

    $$('.sfst').each((i, elem) => {
        allCompliment.push($(elem).text());
    });

    const randomNumber = Math.floor(Math.random() * allCompliment.length);
    const messageToSend = `${recipient} ${allCompliment[randomNumber]}`;

    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, messageToSend);
}


module.exports = { rofl, meme, thisMeme, neUmnichai, ktoI, shock, thanks, say, getDocument, compliment };


// function subCount(bot, msg) {
//     const chatId = msg.chat.id;
//     const messageId = msg.message_id;

//     const inlineKeyboard = {
//         inline_keyboard: [
//             [{
//                 text: 'Timarius',
//                 callback_data: 'Timarius',
//             }],
//             [{
//                 text: 'Extra Gay',
//                 callback_data: 'Extra Gay',
//             }],
//             [{
//                 text: 'Ютубер Санек',
//                 callback_data: 'Youtuber Sanek',
//             }],
//             [{
//                 text: 'Елисей',
//                 callback_data: 'Elecey',
//             }],
//         ],
//         resize_keyboard: true,
//         one_time_keyboard: true,
//     };

//     bot.deleteMessage(chatId, messageId);
//     bot.sendMessage(chatId, 'Выберете автора:', {
//         reply_markup: inlineKeyboard,
//     });
// }

// async function callbackSubCount(bot, callbackQuery) {
//     const chatId = callbackQuery.message.chat.id;
//     const messageId = callbackQuery.message.message_id;
//     const authorName = callbackQuery.data;
//     let channelURL;

//     if (authorName === 'Timarius') {
//         channelURL = 'https://www.youtube.com/@TimariusGod';
//     } else if (authorName === 'Extra Gay') {
//         channelURL = 'https://www.youtube.com/@extragay4665';
//     } else if (authorName === 'Youtuber Sanek') {
//         channelURL = 'https://www.youtube.com/@user-rv4bs8pg1g';
//     } else if (authorName === 'Elecey') {
//         channelURL = 'https://www.youtube.com/@user-ff3or6bz3e';
//     } else {
//         bot.deleteMessage(chatId, messageId);
//         return;
//     }


//     const siteMarkup = await fetch(channelURL)
//         .then(res => res.text());

//     const subCount = '';

//     await bot.deleteMessage(chatId, messageId);
//     await bot.sendMessage(chatId, subCount || 'fuck u');
// }