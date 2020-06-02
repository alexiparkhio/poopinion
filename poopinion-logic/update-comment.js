const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Updates the user's comment on a toilet post
 * 
 * @param {string} commentId comment's unique ID
 * @param {Object} rating all rating info
 * 
 * @returns {string} user's unique token
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 * @throws {NotFoundError} on non-existent user
 */

module.exports = function (commentId, rating) {
    validate.stringFrontend(commentId, 'commentId')
    validate.type(rating, 'rating', Object)

    return (async() => {
        const token = await this.storage.getItem('token')
        
        return await fetch.patch(`${this.API_URL}/users/comment/${commentId}`, rating, token)
    })()
}.bind(context)