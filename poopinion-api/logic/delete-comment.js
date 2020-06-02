const { validate } = require('poopinion-utils')
const { models: { User, Toilet, Comment } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Deletes a comment and removes its track from both users and toilets
 * 
 * @param {string} id user's unique id
 * @param {string} toiletId toilet's unique id
 * @param {object} commentId comment's unique id
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful delete
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user, toilet or comment do not exist
 */

module.exports = (id, toiletId, commentId) => {
    validate.string(id, 'id')
    validate.string(toiletId, 'toilet ID')
    validate.string(commentId, 'comment ID')

    return Promise.all([User.findById(id), Toilet.findById(toiletId), Comment.findById(commentId)])
        .then(([user, toilet, comment]) => {

            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)
            if (!comment) throw new NotFoundError(`comment with id ${commentId} does not exist`)

            return Promise.all([User.findByIdAndUpdate(id, { $pull: { comments: commentId } }), Toilet.findByIdAndUpdate(toiletId, { $pull: { comments: commentId } })])
        })
        .then(() => Comment.findByIdAndRemove(commentId))
        .then(() => { })
}