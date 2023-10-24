const smiles = require("./smiles")

const chooseRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * smiles.length);
    return smiles[randomIndex];
}

const getEmojis = () => chooseRandomEmoji() + chooseRandomEmoji();

const monday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">инфа (1)</a>
08:55 - <a href="${links[1]}">ист укр</a>
09:50 - <a href="${links[2]}">всесв ист</a>
10:50 - <a href="${links[3]}">биология</a>
12:40 - <a href="${links[4]}">англ</a>
13:35 - <a href="${links[5]}">зах укр</a>`

const tuesday = (date, links) => `Уроки на ${date}: ${getEmojis()}
09:50 - <a href="${links[0]}">укр мова</a>
11:45 - <a href="${links[1]}">алгебра</a>
13:35 - <a href="${links[2]}">физра</a>`

const wednesday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">ист укр</a>
08:55 - <a href="${links[1]}">всесв ист</a>
09:50 - <a href="${links[2]}">география</a>
10:50 - <a href="${links[3]}">химия</a>
11:45 - <a href="${links[4]}">зар лит</a>
12:40 - <a href="${links[5]}">инфа (2)</a>`

const thursday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">физика</a>
08:55 - <a href="${links[1]}">физика</a>
09:50 - <a href="${links[2]}">геометрия</a>
11:45 - <a href="${links[3]}">укр лит</a>
13:35 - <a href="${links[4]}">англ</a>`

const friday = (date, links) => `Уроки на ${date}: ${getEmojis()}
08:00 - <a href="${links[0]}">ист укр</a>
08:55 - <a href="${links[1]}">всесв ист</a>
09:50 - <a href="${links[2]}">физра</a>
10:50 - <a href="${links[3]}">мист</a>
11:45 - <a href="${links[4]}">физика</a>
12:40 - <a href="${links[5]}">астрономия</a>
13:35 - <a href="${links[6]}">химия</a>`

module.exports = [monday, tuesday, wednesday, thursday, friday]