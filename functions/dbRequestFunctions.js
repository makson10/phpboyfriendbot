const axios = require('axios').default;

const getHWLinks = async () => {
    const hwLinks = await axios
        .get(process.env.MEDIATOR_BASE_URL + '/hw')
        .then(res => res.data["homeworks"]);

    return hwLinks;
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

module.exports = {
    getHWLinks,
    getVars,
    getLinkMessageId,
}