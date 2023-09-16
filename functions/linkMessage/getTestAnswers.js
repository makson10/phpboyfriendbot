const bot = require("@/bot");
const axios = require("axios").default;
const cheerio = require("cheerio");

let attemptGettingPageMarkup = 0;

const answersList = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Є',
    'Ж',
    'З',
];

const getPageWithAnswersMarkup = async (link) => {
    const markup = await axios.get(link).then(res => res.data);
    return markup;
}

const getAnswersFromTest = async (link) => {
    const markup = await getPageWithAnswersMarkup(link);
    const $ = cheerio.load(markup);
    const testData = {};

    $('.homework-personal-stat-test').each((i, elem) => {
        const element = $(elem);
        const elementText = element.text();

        testData.title = elementText;
    });

    $('.homework-stats').each((i, elem) => {
        const element = $(elem);
        testData.answers = Array.from({ length: element.children().length }, (_, i) => []);

        element.children().map((index, element) => {
            $(element).find('.correct.quiz, .correct.multiquiz').each((i, correctAnswerElement) => {
                const correctAnswerIndex = +($(correctAnswerElement).text());
                const correctAnswer = answersList[correctAnswerIndex - 1];
                testData.answers[index].push(correctAnswer);
            });
        });
    });

    return testData;
}

const formAnswerListMessage = (testData) => {
    let newMessageText = '';

    newMessageText += '<b>' + testData.title + '</b>\n';

    testData.answers.map((answers, index) => {
        const answer = answers.join(', ');
        newMessageText += (index + 1) + '. ' + answer + '\n';
    });

    return newMessageText;
}

const sendMessageWithAnswer = async (chatId, testData) => {
    const messageText = formAnswerListMessage(testData);
    await bot.sendMessage(chatId, messageText, { parse_mode: "HTML" });
}

const sendTestAnswersToChat = async (chatId, link) => {
    const testData = await getAnswersFromTest(link);
    await sendMessageWithAnswer(chatId, testData);
}

const getTestAnswers = async (msg, link, shouldDeleteMessage = true) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    try {
        if (shouldDeleteMessage) await bot.deleteMessage(chatId, messageId);
    } catch (error) {
        console.log(error);
    }

    try {
        await sendTestAnswersToChat(chatId, link);
    } catch (error) {
        if (attemptGettingPageMarkup >= 10) return;

        attemptGettingPageMarkup++;
        setTimeout(async () => {
            await sendTestAnswersToChat(chatId, link);
        }, 2000);
    } finally {
        attemptGettingPageMarkup = 0;
    }
}

module.exports = getTestAnswers;