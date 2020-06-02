const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Deletes the user's toilet post
 * 
 * @param {string} toiletId toilet's unique ID
 * 
 * @returns {undefined} returns undefined on a successful delete
 * 
 * @throws {NotAllowedError} on a deactivated user
 * @throws {NotFoundError} on non-existent user, toilet or comment
 */

module.exports = function (toiletId) {
    validate.stringFrontend(toiletId, 'toiletId')

    return (async() => {
        const token = await this.storage.getItem('token')

        await fetch.delete(`${this.API_URL}/toilet/${toiletId}/delete-image`)
        await fetch.delete(`${this.API_URL}/users/toilet/${toiletId}/delete`, token)
    })()
}.bind(context)