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
    const day = scheduleDate.getDate();
    const month = scheduleDate.getMonth() + 1;

    if (day.toString().length === 1) day = '0' + day;
    return day + '.' + month;
}

const getScheduleMessage = (links) => {
    const scheduleDate = new Date(getScheduleDate());

    const dayOfWeek = getScheduleDayOfWeek(scheduleDate);
    const fullDate = getFullScheduleDate(scheduleDate);

    return scheduleMessages[dayOfWeek](fullDate, links);
}

module.exports = getScheduleMessage;