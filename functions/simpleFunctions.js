const axios = require('axios').default;
const cheerio = require("cheerio");
const roflArray = require("../assets/rofls");
const memesLink = require("../assets/memesLink");
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

    const firstStickerPackData = await bot.getStickerSet('NiggersMeme');
    const secondStickerPackData = await bot.getStickerSet('Jakkakskzksakoa_by_demybot');
    const stickerArray = [...firstStickerPackData['stickers'], ...secondStickerPackData['stickers']];
    const randomNumber = Math.floor(Math.random() * stickerArray.length);

    bot.sendSticker(chatId, stickerArray[randomNumber]['file_id'], {
        reply_to_message_id: messageId,
    });
}

// async function compliment(bot, msg, match) {
//     const chatId = msg.chat.id;
//     const messageId = msg.message_id;
//     const recipient = match[1];

//     if (recipient.slice(0, 1) !== '@') {
//         await bot.deleteMessage(chatId, messageId);
//         return;
//     }


//     const firstSiteMarkup = await axios.get('https://pozdravok.com/pozdravleniya/lyubov/komplimenty/', {
//         headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
//         responseType: 'arraybuffer'
//     })
//         .then(res => res.data)
//         .then(buffer => {
//             const decoder = new TextDecoder('windows-1251', { fatal: true });
//             const text = decoder.decode(buffer);
//             return text;
//         });

//     const secondSiteMarkup = await axios.get('https://pozdravok.com/pozdravleniya/lyubov/komplimenty/2.htm', {
//         headers: { "Content-Type": 'text/plain; charset=UTF-8' },
//         responseType: 'arraybuffer'
//     })
//         .then(res => res.data)
//         .then(buffer => {
//             const decoder = new TextDecoder('windows-1251', { fatal: true });
//             const text = decoder.decode(buffer);
//             return text;
//         });

//     const $ = cheerio.load(firstSiteMarkup);
//     const $$ = cheerio.load(secondSiteMarkup);
//     const allCompliment = [];

//     $('.sfst').each((i, elem) => {
//         allCompliment.push($(elem).text());
//     });

//     $$('.sfst').each((i, elem) => {
//         allCompliment.push($(elem).text());
//     });

//     const randomNumber = Math.floor(Math.random() * allCompliment.length);
//     const messageToSend = `${recipient} ${allCompliment[randomNumber]}`;

//     await bot.deleteMessage(chatId, messageId);
//     await bot.sendMessage(chatId, messageToSend);
// }

async function spam(bot, msg, match) {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const data = match[1];

    if (!data.includes(':')) return;

    const dataArray = data.split(':');
    let victim;

    const vars = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/vars')
        .then(res => res.data);

    switch (dataArray[1]) {
        case 'maks':
            victim = vars[0]['vars']['Makson_w_chat_id'];
            break;

        case 'snus':
            victim = vars[0]['vars']['Timarius73_chat_id'];
            break;

        case 'vlad':
            victim = vars[0]['vars']['Klymvl_chat_id'];
            break;

        case 'vika':
            victim = vars[0]['vars']['pidoprigora21_chat_id'];
            break;

        case 'dima':
            victim = vars[0]['vars']['Dimon897_chat_id'];
            break;

        default:
            break;
    }

    for (let i = 0; i < dataArray[0]; i++) {
        bot.sendMessage(victim, dataArray[2]);
    }

    await bot.deleteMessage(chatId, messageId);
}

module.exports = {
    rofl,
    meme,
    shock,
    say,
    getDocument,
    spam
};
