const isMessageFromGroup = ({ chat: { type } }) => {
    return type === "supergroup";
}

const isMessageFromSuperAdmin = ({ from: { username } }) => {
    return username === "Makson_w";
}

module.exports = {
    isMessageFromGroup,
    isMessageFromSuperAdmin
};