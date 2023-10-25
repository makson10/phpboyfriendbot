const handleLessonSchedule = require('./lessonsPin/handleLessonSchedule');
const { addLinksToSchedule, callbackAddLinks, callbackAcceptNewLinks } = require('./lessonsPin/addLinksToSchedule');
const checkIfAddedNewLessons = require('./lessonsPin/checkIfAddedNewLessons');
const sendScheduleMessage = require('./lessonsPin/sendScheduleMessage');
const renderScheduleMessage = require('./lessonsPin/renderScheduleMessage');
const removeLessonFromMessage = require('./lessonsPin/removeLessonFromMessage');
const addLessonToMessage = require('./lessonsPin/addLessonToMessage');
const { callbackRemoveLesson } = require('./lessonsPin/callbacks');

module.exports = {
    handleLessonSchedule,
    addLinksToSchedule,
    callbackAddLinks,
    callbackAcceptNewLinks,
    checkIfAddedNewLessons,
    sendScheduleMessage,
    renderScheduleMessage,
    removeLessonFromMessage,
    addLessonToMessage,
    callbackRemoveLesson,
};