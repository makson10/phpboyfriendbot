const bot = require('@/bot');

const getAllStickers = async () => {
    const firstStickerPack = await bot.getStickerSet('NiggersMeme');
    const secondStickerPack = await bot.getStickerSet('Jakkakskzksakoa_by_demybot');
    const thirdStickerPack = await bot.getStickerSet('packghoul');

    const stickers = [
        ...firstStickerPack['stickers'],
        ...secondStickerPack['stickers'],
        ...thirdStickerPack['stickers']
    ];

    return stickers;
};

const chooseRandomSticker = (stickers) => {
    const randomNumber = Math.floor(Math.random() * stickers.length);
    return stickers[randomNumber]['file_id'];
};

const sendStikerAfterGetHW = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    const stickers = await getAllStickers();
    const stickerToSend = chooseRandomSticker(stickers);

    bot.sendSticker(chatId, stickerToSend, {
        reply_to_message_id: messageId,
    });
}

module.exports = sendStikerAfterGetHW;