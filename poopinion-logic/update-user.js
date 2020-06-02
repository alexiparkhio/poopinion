const { validate } = require('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Updates the user's info. Requires a password
 * 
 * @param {Object} data all new data info
 * 
 * @returns {undefined} undefined on a successful update
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 * @throws {NotFoundError} on non-existent user
 */

module.exports = function (data) {
    validate.type(data, 'data', Object)
    const { password, newPassword, age } = data 
    validate.string(age, 'age')
    validate.age(age)
    validate.stringFrontend(password, 'password')
    if (!newPassword) delete data.newPassword

    return (async() => {
        const token = await this.storage.getItem('token')
       
        return await fetch.patch(`${this.API_URL}/users/`, data, token)
    })()
}.bind(context)