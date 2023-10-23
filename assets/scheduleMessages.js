const smiles = require("./smiles")

const chooseRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * smiles.length);
    return smiles[randomIndex];
}

const getEmojis = () => chooseRandomEmoji() + chooseRandomEmoji();

const monday = (date) => `Уроки на ${date}: ${getEmojis()}
08:00 - инфа (1)
08:55 - ист укр
09:50 - всесв ист
10:50 - биология
12:40 - англ
13:35 - зах укр`

const tuesday = (date) => `Уроки на ${date}: ${getEmojis()}
09:50 - укр мова
11:45 - алгебра
13:35 - физра`

const wednesday = (date) => `Уроки на ${date}: ${getEmojis()}
08:00 - ист укр
08:55 - всесв ист
09:50 - география
10:50 - химия
11:45 - зар лит
12:40 - инфа (2)`

const thursday = (date) => `Уроки на ${date}: ${getEmojis()}
08:00 - физика
08:55 - физика
09:50 - геометрия
11:45 - укр лит
13:35 - англ`

const friday = (date) => `Уроки на ${date}: ${getEmojis()}
08:00 - ист укр
08:55 - всесв ист
09:50 - физра
10:50 - мист
11:45 - физика
12:40 - астрономия
13:35 - химия`

module.exports = [monday, tuesday, wednesday, thursday, friday]