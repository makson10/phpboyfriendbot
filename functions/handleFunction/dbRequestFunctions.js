const axios = require('axios').default;

const getHWLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/hw')
        .then(res => res.data);

    return hwLinks;
};

const getLessonSchedule = async () => {
    const lessonSchedule = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/lessons')
        .then(res => res.data['lessons']);

    return lessonSchedule;
};

const getLessonsLinks = async () => {
    const lessons = await getLessonSchedule();
    return lessons.map((lesson) => lesson.link);
}

const getVars = async () => {
    const vars = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/vars')
        .then(res => res.data['vars']);

    return vars;
}

const getSupergroupId = async () => {
    const vars = await getVars();
    return '-100' + vars["supergroup_chat_id"];
};

const getLinkMessageId = async () => {
    const vars = await getVars();
    return vars["LINK_MESSAGE_ID"];
};

const getScheduleMessageId = async () => {
    const vars = await getVars();
    return vars["LESSON_SCHEDULE_MESSAGE_ID"];
};

module.exports = {
    getHWLinks,
    getLessonSchedule,
    getLessonsLinks,
    getVars,
    getSupergroupId,
    getLinkMessageId,
    getScheduleMessageId,
}