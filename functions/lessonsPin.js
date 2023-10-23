const handleLessonSchedule = require('./lessonsPin/handleLessonSchedule');
const { addLinksToSchedule, callbackAddLinks, callbackAcceptNewLinks } = require('./lessonsPin/addLinksToSchedule');
const checkIfAddedNewLessons = require('./lessonsPin/checkIfAddedNewLessons');
const sendScheduleMessage = require('./lessonsPin/sendScheduleMessage');

module.exports = {
    handleLessonSchedule,
    addLinksToSchedule,
    callbackAddLinks,
    callbackAcceptNewLinks,
    checkIfAddedNewLessons,
    sendScheduleMessage,
};