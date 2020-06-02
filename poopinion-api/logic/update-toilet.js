const { validate } = require('poopinion-utils')
const { models: { User, Toilet } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Updates the comment post info
 * 
 * @param {string} id user's unique ID
 * @param {string} toiletId toilet's unique id
 * @param {object} data the elements that will be updated
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * 
 * @throws {NotAllowedError} if a user is deactivated
 * @throws {NotFoundError} if the user or the toilet do not exist
 */

module.exports = (id, toiletId, data) => {
    validate.string(id, 'id')
    validate.string(toiletId, 'toilet ID')
    validate.type(data, 'data', Object)

    return Promise.all([User.findById(id), Toilet.findById(toiletId)])
        .then(([user, toilet]) => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)

            return Toilet.findByIdAndUpdate(toiletId, { $set: data })
        })
        .then(() => { })
}