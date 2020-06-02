const fetch = require('./fetch')
const context = require('./context')

/**
 * Retrieves an authorized user
 * 
 * @returns {Object} an Object containing all user's info
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 * @throws {NotFoundError} on non-existent user
 */

module.exports = function () {
    return (async() => {
        const token = await this.storage.getItem('token')
        
        return await fetch.get(`${this.API_URL}/users`, token)
    })()
}.bind(context)