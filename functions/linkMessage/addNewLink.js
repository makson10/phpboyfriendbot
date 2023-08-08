const bot = require('@/bot');
const axios = require('axios').default;
const addNewLinkAnswers = require('@assets/addNewLinkAnswers');
const renderLinkMessage = require('./renderLinkMessage');

const getHWLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/api/hw')
        .then(res => res.data["homeworks"]);

    return hwLinks;
};

const getCommandParameters = (messageText) => {
    let messageParameter = messageText.replace('/add_new_link', '').trim();

    if (/^@PHPBoyFriendBot/gmi.test(messageParameter)) {
        messageParameter = messageParameter.replace('@PHPBoyFriendBot', '').trim();
    }

    return messageParameter;
};

const haveMessageReplyProperty = (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const replyMessage = msg.reply_to_message;

    if (!replyMessage) {
        bot.deleteMessage(chatId, messageId);
        bot.sendMessage(
            chatId,
            "Ты не указал, что мне нужно сохранить, так что подумай над своим поведением"
        );

        return;
    } else return true;
}

const reduceLessonTitleLength = (text) => {
    return text.slice(0, 30);
}

const determineLessonTitleFromReplyMessage = (messageParameter, replyMessage) => {
    let lessonTitle;

    if (messageParameter !== '') {
        lessonTitle = messageParameter
    } else {
        if (replyMessage.hasOwnProperty("caption")) {
            lessonTitle = replyMessage['caption'].split("\n")[0];
        } else if (replyMessage.hasOwnProperty("document")) {
            lessonTitle = replyMessage.document.file_name;
        } else if (replyMessage.hasOwnProperty("text")) {
            lessonTitle = replyMessage["text"].split("\n")[0];
        }
    }

    return lessonTitle;
}

const formHwTitle = async (msg, wasInvokedFromCommand) => {
    const replyMessage = msg.reply_to_message;
    const messageText = msg.text;

    const messageParameter = getCommandParameters(messageText);
    let lessonTitle;

    if (!wasInvokedFromCommand) {
        lessonTitle = messageText;
    } else {
        if (!haveMessageReplyProperty(msg)) return;
        lessonTitle = determineLessonTitleFromReplyMessage(messageParameter, replyMessage);
    }

    lessonTitle = reduceLessonTitleLength(lessonTitle);
    lessonTitle = await addLessonTitleSufix(lessonTitle);

    return lessonTitle;
};

const addLessonTitleSufix = async (lessonTitle) => {
    const hwLinks = await getHWLinks();
    if (!hwLinks.length) return lessonTitle;

    const linksWithSameName = await hwLinks.map(hwLink => {
        if (hwLink.lessonTitle.includes(lessonTitle)) return hwLink;
    }).filter(elem => elem !== undefined);

    if (linksWithSameName.length) {
        return lessonTitle += '_' + (linksWithSameName.length + 1);
    } else return lessonTitle;
};

const formHwLink = (chatId, messageId) => {
    const link = `https://t.me/c/${chatId}/${messageId}`;
    return link;
};

const formNewHW = async (msg, wasInvokedFromCommand) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const lessonTitle = await formHwTitle(msg, wasInvokedFromCommand);
    if (!lessonTitle) return;

    const link = formHwLink(chatId, messageId);

    const hw = {
        lessonTitle: lessonTitle,
        link: link,
    };

    return hw;
};

const storeNewHWInServer = async (hw) => {
    await axios.post(process.env.MEDIATOR_BASE_URL + '/api/hw', hw);
};

const sendRandomAnswer = async (chatId, messageId) => {
    await bot.deleteMessage(chatId, messageId);

    const randomBotAnswerIndex = Math.floor(Math.random() * addNewLinkAnswers.length);
    const botAnswer = addNewLinkAnswers[randomBotAnswerIndex];

    await bot.sendMessage(chatId, botAnswer);
};

const addNewLink = async (msg, wasInvokedFromCommand = true) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const newHW = await formNewHW(msg, wasInvokedFromCommand);
    if (!newHW) return;

    await storeNewHWInServer(newHW);

    await sendRandomAnswer(chatId, messageId);
    await renderLinkMessage(chatId);
}

module.exports = addNewLink;