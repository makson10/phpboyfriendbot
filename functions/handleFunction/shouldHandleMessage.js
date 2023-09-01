const bot = require('@/bot');
const { isMessageFromGroup, isMessageFromSuperAdmin } = require('./checkPermissions');

const sendErrorMessageToUser = (chatId, messageId) => {
    bot.deleteMessage(chatId, messageId);
    bot.sendMessage(
        chatId,
        "Вы не обладаете нужными правами, чтоб сделать это, так что нэт 😒"
    );
}

const shouldHandleMessage = (msg) => {
    if (isMessageFromGroup(msg) || isMessageFromSuperAdmin(msg)) return true;
    else sendErrorMessageToUser(msg.chat.id, msg.message_id);
}

module.exports = shouldHandleMessage;