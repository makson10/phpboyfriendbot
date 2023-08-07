const isMessageFromGroup = ({ chat: { type } }) => {
    return type === "group" || type === "supergroup";
}

const isMessageFromSuperAdmin = ({ from: { username } }) => {
    return username === "Makson_w";
}

module.exports = {
    isMessageFromGroup,
    isMessageFromSuperAdmin
};