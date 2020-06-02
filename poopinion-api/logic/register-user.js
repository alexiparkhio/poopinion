const { validate, isValidDate } = require('poopinion-utils')
const { models: { User } } = require('poopinion-data')
const { NotAllowedError } = require('poopinion-errors')
const bcrypt = require('bcryptjs')

/**
 * Registers a new user on the database
 * 
 * @param {string} name user's name
 * @param {string} surname user's surname
 * @param {string} email user's unique e-mail
 * @param {string} password user's password, with further encryptation
 * @param {number} age user's age
 * @param {string} gender user's gender, with a three-choice only
 * 
 * @returns {Promise<string>} an empty Promise on a successful registration
 * 
 * @throws {NotAllowedError} if a user with that same email already exists on the database
 */

module.exports = (name, surname, email, password, age, gender) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.string(age, 'age')
    validate.age(age)
    validate.string(gender, 'gender')
    validate.gender(gender)
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, email, age, gender, password, created: new Date })

            return user.save()
        })
        .then(() => { })

}