const { getScheduleMessageId, getLessonSchedule } = require("@/functions/handleFunction/dbRequestFunctions");
const handleLessonSchedule = require("./handleLessonSchedule");

const checkIfAddedNewLessons = async (msg) => {
    const scheduleMessageId = await getScheduleMessageId();
    if (!msg.message_id === scheduleMessageId) return;

    const lessons = await getLessonSchedule();

    const messageByLines = msg.text.split("\n");
    const editedLessonSchedule = messageByLines.slice(1);
    if (editedLessonSchedule.length > lessons.length) handleLessonSchedule(msg);
}

module.exports = checkIfAddedNewLessons;