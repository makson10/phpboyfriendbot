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
        .then(res => res.data);

    return lessonSchedule;
};

const getVars = async () => {
    const vars = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/vars')
        .then(res => res.data['vars']);

    return vars;
}

const getLinkMessageId = async () => {
    const vars = await getVars();
    return vars["LINK_MESSAGE_ID"];
};

const getLessonScheduleMessageId = async () => {
    const vars = await getVars();
    return vars["LESSON_SCHEDULE_MESSAGE_ID"];
};

module.exports = {
    getHWLinks,
    getLessonSchedule,
    getVars,
    getLinkMessageId,
    getLessonScheduleMessageId,
}