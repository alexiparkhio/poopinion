const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Toggles or untoggles the selected toilet to favorites
 * 
 * @param {string} toiletId toilet's unique ID
 * 
 * @returns {undefined} returns undefined if the toggle or untoggle was successful
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user or the toilet do not exist
 */

module.exports = function (toiletId) {
    validate.stringFrontend(toiletId, 'toiletId')

    return (async() => {
        const token = await this.storage.getItem('token')
       
        return await fetch.patch(`${this.API_URL}/users/toilet/${toiletId}/favorite`, undefined, token)
    })()
}.bind(context)