const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Retrieves the detailed info about an specific toilet
 * 
 * @param {string} toiletId toilet's unique ID
 * 
 * @returns {Object} returns an object with all the toilet info
 * 
 * @throws {NotFoundError} if the toilet does not exist
 */

module.exports = function (toiletId) {
    validate.stringFrontend(toiletId, 'toiletId')

    return (async() => await fetch.get(`${this.API_URL}/toilets/${toiletId}`))()
}.bind(context)