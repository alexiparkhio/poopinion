const { validate } = require('poopinion-utils')
const { models: { User } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const bcrypt = require('bcryptjs')

/**
 * Checks user credentials against the storage
 * 
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 * 
 * @returns {Promise<string>} user's id from storage
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 */

module.exports = (email, password) => {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (!user) throw new NotAllowedError(`wrong credentials`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${user.id} is deactivated`)

            return bcrypt.compare(password, user.password)
                .then(validPassword => {
                    if (!validPassword) throw new NotAllowedError(`wrong credentials`)

                    user.authenticated = new Date

                    return user.save()
                })
                .then(({ id }) => id)
        })
}