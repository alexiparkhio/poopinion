const { validate } = require('poopinion-utils')
const { models: { User } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const bcrypt = require('bcryptjs')

/**
 * Updates the user's info
 * 
 * @param {string} id user's unique ID
 * @param {object} data the elements that will be updated
 * @param {string} password user's password
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * 
 * @throws {NotAllowedError} if a user set a wrong password
 * @throws {NotFoundError} if the user does not exist
 */

module.exports = (id, data, password) => {
    validate.string(id, 'id')
    validate.type(data, 'data', Object)
    validate.string(password, 'password')

    const { newPassword } = data

    if (typeof newPassword !== 'undefined') {
        validate.string(newPassword, 'newPassword')
    }

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)

            return bcrypt.compare(password, user.password)
                .then(validPassword => {
                    if (!validPassword) throw new NotAllowedError(`wrong credentials`)

                    return User.findByIdAndUpdate(id, { $set: data })
                })
                .then(() => {
                    if (typeof newPassword !== 'undefined') {
                        return bcrypt.hash(newPassword, 10)
                            .then(newPass => User.findByIdAndUpdate(id, { $set: { newPassword: newPass } }))
                            .then(() => User.findById(id))
                            .then(user => {
                                delete user.password
                                user.password = user.newPassword
                                delete user.newPassword

                                return user.save()
                            })
                            .then(() => { })
                    }
                })
        })
}