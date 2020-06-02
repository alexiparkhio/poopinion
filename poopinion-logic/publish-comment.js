const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Publishes a new comment on a toilet post
 * 
 * @param {string} toiletId toilet's unique ID
 * @param {Object} rating all rating info
 * 
 * @returns {string} user's unique token
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 * @throws {NotFoundError} on non-existent user
 */

module.exports = function (toiletId, rating) {
    validate.stringFrontend(toiletId, 'toiletId')
    validate.type(rating, 'rating', Object)

    return (async() => {
        const token = await this.storage.getItem('token')

        await fetch.post(`${this.API_URL}/users/toilet/${toiletId}/comment`, rating, token)
    })()
}.bind(context)