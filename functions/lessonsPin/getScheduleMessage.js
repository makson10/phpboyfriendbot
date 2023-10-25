const scheduleMessages = require("@/assets/scheduleMessages");

const getScheduleDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const nextDate = new Date(currentDate);
    if (currentHour >= 15) nextDate.setDate(currentDate.getDate() + 1);
    return nextDate;
}

const getScheduleMessage = (links) => {
    const scheduleDate = new Date(getScheduleDate());

    const dayOfWeek = scheduleDate.getDay() - 1;
    const fullDate = scheduleDate.getDate().toString() + '.' + (scheduleDate.getMonth() + 1);

    return scheduleMessages[dayOfWeek](fullDate, links);
}

module.exports = getScheduleMessage;