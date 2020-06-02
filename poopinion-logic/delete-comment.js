const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Deletes the user's comment on a toilet post
 * 
 * @param {string} toiletId toilet's unique ID
 * @param {string} commentId comment's unique ID
 * 
 * @returns {undefined} returns undefined on a successful delete
 * 
 * @throws {NotAllowedError} on a deactivated user
 * @throws {NotFoundError} on non-existent user, toilet or comment
 */

module.exports = function (toiletId, commentId) {
    validate.stringFrontend(toiletId, 'toiletId')
    validate.stringFrontend(commentId, 'commentId')
    
    return (async() => {
        const token = await this.storage.getItem('token')

        await fetch.delete(`${this.API_URL}/users/toilet/${toiletId}/comment/${commentId}/delete`, token)
    })()
}.bind(context)