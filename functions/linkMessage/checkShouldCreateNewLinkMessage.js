const setupNewLinkMessage = require('./setupNewLinkMessage');
const { getLinkMessageId } = require('@/functions/handleFunction/dbRequestFunctions');

const checkShouldCreateNewLinkMessage = async (msg) => {
    const messageId = msg.message_id;
    if (messageId % 50 !== 0) return;

    const linkMessageId = await getLinkMessageId();

    if (messageId >= linkMessageId + 280) {
        await setupNewLinkMessage(msg, false);
    }
}

module.exports = checkShouldCreateNewLinkMessage;