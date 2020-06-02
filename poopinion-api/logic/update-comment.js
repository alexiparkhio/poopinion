const { validate } = require('poopinion-utils')
const { models: { User, Comment } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Updates the user's comment data
 * 
 * @param {string} id user's unique ID
 * @param {string} commentId comment's unique id
 * @param {object} data the elements that will be updated
 * 
 * @returns {Promise<string>} an empty Promise on a successful update
 * 
 * @throws {NotAllowedError} if a user set a wrong password or is deactivated
 * @throws {NotFoundError} if the user or the comment do not exist
 */

module.exports = (id, commentId, data) => {
    validate.string(id, 'id')
    validate.string(commentId, 'comment ID')
    validate.type(data, 'data', Object)

    return Promise.all([User.findById(id), Comment.findById(commentId)])
        .then(([user, comment]) => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!comment) throw new NotFoundError(`comment with id ${commentId} does not exist`)

            return Comment.findByIdAndUpdate(commentId, { $set: data })
        })
        .then(() => { })
}