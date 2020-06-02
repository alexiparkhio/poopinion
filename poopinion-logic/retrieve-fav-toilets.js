const fetch = require('./fetch')
const context = require('./context')

/**
 * Retrieves all toilets that are marked as favorite by the user
 * 
 * @returns {Array} returns an array of all the toilet posts. Empty array if there is none.
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = function () {
    return (async() => {
        const token = await this.storage.getItem('token')
        
        return await fetch.get(`${this.API_URL}/users/favorites`, token)
    })()
}.bind(context)