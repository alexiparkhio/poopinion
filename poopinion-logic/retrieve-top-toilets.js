const fetch = require('./fetch')
const context = require('./context')

/**
 * Retrieves toilets sorted by the highest ranked
 * 
 * @returns {Array} array of toilets meeting the criteria. Empty array if no toilets are available
 * 
 */

module.exports = function () {
    return (async() =>  await fetch.get(`${this.API_URL}/top-toilets`))()
}.bind(context)