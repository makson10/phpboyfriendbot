const smiles = require("./smiles")

const chooseRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * smiles.length);
    return smiles[randomIndex];
}

const getEmojis = () => chooseRandomEmoji() + chooseRandomEmoji();

const monday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">Инфа (1)</a>
08:55 - <a href="${links[1]}">Ист укр</a>
09:50 - <a href="${links[2]}">Всесв ист</a>
10:50 - <a href="${links[3]}">Биология</a>
12:40 - <a href="${links[4]}">Англ</a>
13:35 - <a href="${links[5]}">Зах укр</a>`

const tuesday = (date, links) => `Уроки на ${date}: ${getEmojis()}
09:50 - <a href="${links[0]}">Укр мова</a>
11:45 - <a href="${links[1]}">Алгебра</a>
13:35 - <a href="${links[2]}">Физра</a>`

const wednesday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">Ист укр</a>
08:55 - <a href="${links[1]}">Всесв ист</a>
09:50 - <a href="${links[2]}">География</a>
10:50 - <a href="${links[3]}">Химия</a>
11:45 - <a href="${links[4]}">Зар лит</a>
12:40 - <a href="${links[5]}">Инфа (2)</a>`

const thursday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">Физика</a>
08:55 - <a href="${links[1]}">Физика</a>
09:50 - <a href="${links[2]}">Геометрия</a>
11:45 - <a href="${links[3]}">Укр лит</a>
13:35 - <a href="${links[4]}">Англ</a>`

const friday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">Ист укр</a>
08:55 - <a href="${links[1]}">Всесв ист</a>
09:50 - <a href="${links[2]}">Физра</a>
10:50 - <a href="${links[3]}">Мист</a>
11:45 - <a href="${links[4]}">Физика</a>
12:40 - <a href="${links[5]}">Астрономия</a>
13:35 - <a href="${links[6]}">Химия</a>`

module.exports = [monday, tuesday, wednesday, thursday, friday]