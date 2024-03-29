const scheduleMessages = require("@/assets/scheduleMessages");

const getScheduleDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const nextDate = new Date(currentDate);
    if (currentHour >= 15) nextDate.setDate(currentDate.getDate() + 1);
    return nextDate;
}

const getScheduleDayOfWeek = (scheduleDate) => {
    const dayOfWeek = scheduleDate.getDay() - 1;
    return dayOfWeek;
}

const getFullScheduleDate = (scheduleDate) => {
    let day = scheduleDate.getDate();
    let month = scheduleDate.getMonth() + 1;

    if (day.toString().length === 1) day = '0' + day;
    if (month.toString().length === 1) month = '0' + month;
    return day + '.' + month;
}

const getScheduleMessage = (links) => {
    const scheduleDate = new Date(getScheduleDate());

    const dayOfWeek = getScheduleDayOfWeek(scheduleDate);
    const fullDate = getFullScheduleDate(scheduleDate);

    return scheduleMessages[dayOfWeek](fullDate, links);
}

module.exports = getScheduleMessage;