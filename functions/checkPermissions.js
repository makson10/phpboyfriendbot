function isMessageFromGroup({ chat: { type } }) {
    return type === "supergroup";
}

function isMessageFromSuperAdmin({ from: { username } }) {
    return username === "Makson_w";
}

module.exports = {
    isMessageFromGroup,
    isMessageFromSuperAdmin
};