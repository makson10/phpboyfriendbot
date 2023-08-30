const bot = require('@/bot');
const axios = require('axios').default;
const cheerio = require('cheerio');

// const formLinksToSend = (text) => {
//     const lines = text.split("\n");
//     const lessons = lines.slice(1);

//     const splitedLinks = lessons.map((lesson) => {
//         return lesson.split(" - ");
//     });

//     return splitedLinks;
// }

// const sendNewLinksToServer = async (newLinks) => {
//     await axios.post(process.env.MEDIATOR_BASE_URL + '/lessons/addLinks', { lessonLinks: newLinks });
// }

// const addLinksToSchedule = async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;

//     const links = formLinksToSend(text);
//     await sendNewLinksToServer(links);
//     await bot.sendMessage(chatId, "Ссылки на уроки были добавлены!");
// }


const addLinksToSchedule = async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const date = new Date();
    const dayOfWeek = date.getDay();
    const yesterdayDayOfWeek = dayOfWeek + 1;

    console.log(msg);

    if (yesterdayDayOfWeek === 6 || yesterdayDayOfWeek === 7) {
        await bot.sendMessage(chatId, 'Завтра выходной братик, отдыхай ⛵');
        await bot.deleteMessage(chatId, messageId);
        return;
    }

    const markup = `<div id="root"><div class="journal_journalPaige__3qSyR"><div><div class="jss1"><header class="MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary"><div class="MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"><button class="MuiButtonBase-root MuiIconButton-root jss2 MuiIconButton-colorInherit MuiIconButton-edgeStart" tabindex="0" type="button" aria-label="Open drawer"><span class="MuiIconButton-label"><svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg></span><span class="MuiTouchRipple-root"></span></button><h6 class="MuiTypography-root jss3 MuiTypography-h6 MuiTypography-noWrap">Розклад<span class="head_headTop__wFZNP"></span><span class="head_headTop__wFZNP"></span></h6><div class="jss1"></div></div></header></div><div class="MuiGrid-root mainBlockDaschboard MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-around"><div class="dashboard__margin_top"></div><div class="sixDay"><div class="left1" style="cursor: pointer;"><svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="#000000" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv"><div class="headDate_headerTimeerT__2jMKO">Понеділок</div><div class="headDate_headerCalendarT__3ruSi">28-08-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv"><div class="headDate_headerTimeerT__2jMKO">Вівторок</div><div class="headDate_headerCalendarT__3ruSi">29-08-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv headDate_scheduleCalendarTwo__2a9uk"><div class="headDate_headerTimeerT__2jMKO">Середа</div><div class="headDate_headerCalendarT__3ruSi">30-08-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv"><div class="headDate_headerTimeerT__2jMKO">Четвер</div><div class="headDate_headerCalendarT__3ruSi">31-08-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv"><div class="headDate_headerTimeerT__2jMKO">П'ятниця</div><div class="headDate_headerCalendarT__3ruSi">01-09-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="MuiGrid-root columnWeek MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-2 MuiGrid-grid-lg-2 MuiGrid-grid-xl-2"><div class="headDate_scheduleCalendar__ASKBv"><div class="headDate_headerTimeerT__2jMKO">Субота</div><div class="headDate_headerCalendarT__3ruSi">02-09-2023</div></div><div class="schedule_scrollSchedule__QeytR"></div></div><div class="right1" style="cursor: pointer;"><svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="#000000" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg></div></div></div></div></div></div>`
    const $ = cheerio.load(markup);

    $('.schedule_scrollSchedule__QeytR').each((i, elem) => {
        if (yesterdayDayOfWeek !== i + 1) return;

        const element = $(elem);
        console.log(element.html());
    });

    await bot.deleteMessage(chatId, messageId);
    // await bot.sendMessage(chatId, "Ссылки на уроки были добавлены!");
}

module.exports = addLinksToSchedule;