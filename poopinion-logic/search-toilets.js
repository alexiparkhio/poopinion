const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Retrieves toilets that meet a certain query criteria
 * 
 * @param {string} query query to find the toilets
 * 
 * @returns {Array} array of toilets meeting the criteria. Empty array if no toilets met the criteria
 * 
 */

module.exports = function (query='') {
    validate.stringFrontend(query, 'query')
    
    return (async() => await fetch.get(`${this.API_URL}/toilets?q=${query}`))()
}.bind(context)