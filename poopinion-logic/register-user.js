const { validate } = require ('poopinion-utils')
const fetch = require('./fetch')
const context = require('./context')

/**
 * Registers a new user to the poopinion database
 * 
 * @param {string} name user's name
 * @param {string} surname user's surname
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 * @param {number} age user's age
 * @param {string} gender user's gender
 * 
 * @returns {undefined} on a successful user registration
 * 
 * @throws {Error} if there is a server error or if the user already exists
 */

module.exports = function(name, surname, email, password, age, gender) {
    validate.stringFrontend(name, 'name')
    validate.stringFrontend(surname, 'surname')
    validate.stringFrontend(email, 'email')
    validate.email(email)
    validate.string(age, 'age')
    validate.age(age)
    validate.gender(gender, 'gender')
    validate.stringFrontend(password, 'password')

    return (async() => await fetch.post(`${this.API_URL}/users`, {name, surname, email, password, age, gender}))()
}.bind(context)