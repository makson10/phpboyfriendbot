const checkShouldCreateNewLinkMessage = require('./linkMessage/checkShouldCreateNewLinkMessage');
const setupNewLinkMessage = require('./linkMessage/setupNewLinkMessage');
const addNewLink = require('./linkMessage/addNewLink');
const deleteLink = require('./linkMessage/deleteLink');
const returnLastHWLink = require('./linkMessage/returnLastHWLink');
const deleteAllLinks = require('./linkMessage/deleteAllLinks');
const { callbackDeleteLink, callbackDeleteAllLink } = require('./linkMessage/callbacks');
const getTestAnswers = require('./linkMessage/getTestAnswers');
const renderLinkMessage = require('./linkMessage/renderLinkMessage');

module.exports = {
    checkShouldCreateNewLinkMessage,
    setupNewLinkMessage,
    addNewLink,
    deleteLink,
    callbackDeleteLink,
    returnLastHWLink,
    deleteAllLinks,
    callbackDeleteAllLink,
    getTestAnswers,
    renderLinkMessage,
};
