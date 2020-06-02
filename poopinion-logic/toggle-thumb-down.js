const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Toggles or untoggles the selected comment on thumb down
 * 
 * @param {string} commentId comment's unique ID
 * 
 * @returns {undefined} returns undefined if the toggle or untoggle was successful
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user or the comment do not exist
 */

module.exports = function (commentId) {
    validate.stringFrontend(commentId, 'commentId')

    return (async() => {
        const token = await this.storage.getItem('token')
       
        return await fetch.patch(`${this.API_URL}/users/comment/${commentId}/thumb-down`, undefined, token)
    })()
}.bind(context)