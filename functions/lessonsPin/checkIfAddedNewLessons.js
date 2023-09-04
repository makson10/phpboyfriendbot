const { getLessonScheduleMessageId, getLessonSchedule } = require("@/functions/handleFunction/dbRequestFunctions");
const handleLessonSchedule = require("./handleLessonSchedule");

const checkIfAddedNewLessons = async (msg) => {
    const lessonScheduleMessageId = await getLessonScheduleMessageId();
    if (!msg.message_id === lessonScheduleMessageId) return;

    const lessons = await getLessonSchedule().then((schedule) => schedule.lessons);

    const messageByLines = msg.text.split("\n");
    const editedLessonSchedule = messageByLines.slice(1);
    if (editedLessonSchedule.length > lessons.length) handleLessonSchedule(msg);
}

module.exports = checkIfAddedNewLessons;