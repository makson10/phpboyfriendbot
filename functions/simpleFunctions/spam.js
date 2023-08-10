const bot = require('@/bot');
const { getVars } = require('@functions/dbRequestFunctions');

const determineVictimChatId = async (vitcimName) => {
    const vars = await getVars();

    switch (vitcimName) {
        case 'maks':
            return vars['Makson_w_chat_id'];

        case 'snus':
            return vars['Timarius73_chat_id'];

        case 'vlad':
            return vars['Klymvl_chat_id'];

        case 'vika':
            return vars['pidoprigora21_chat_id'];

        case 'dima':
            return vars['Dimon897_chat_id'];

        default:
            throw Error('Spam for this person does not support');
    }
};

const executeSpam = async (spamParameters) => {
    const [messageCount, vitcimName, messageText] = spamParameters.split(':');
    const victimChatId = await determineVictimChatId(vitcimName);

    for (let i = 0; i < messageCount; i++) {
        await bot.sendMessage(victimChatId, messageText);
    }
}

const spam = async (msg, match) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const spamParameters = match[1];

    if (!spamParameters.includes(':')) return;
    await bot.deleteMessage(chatId, messageId);

    executeSpam(spamParameters);
}

module.exports = spam;