const setupLinkMessage = require('./linkMessage/setupLinkMessage');
const addNewLink = require('./linkMessage/addNewLink');
const deleteLink = require('./linkMessage/deleteLink');
const returnLastHWLink = require('./linkMessage/returnLastHWLink');
const deleteAllLinks = require('./linkMessage/deleteAllLinks');
const { callbackDeleteLink, callbackDeleteAllLink } = require('./linkMessage/callbacks');

module.exports = {
    setupLinkMessage,
    addNewLink,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLinks,
    callbackDeleteAllLink,
};
