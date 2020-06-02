const { validate } = require('poopinion-utils')
const { models: { User, Toilet, Comment } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Publish a new comment with rating on a toilet post
 * 
 * @param {string} id user's unique id
 * @param {string} toiletId toilet's unique id
 * @param {object} rating different ratings for the toilet
 * 
 * @returns {Promise} returns an empty Promise on a successful comment publish
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotAllowedError} if the user already commented on specific toilet
 * @throws {NotFoundError} if the user or the toilet do not exist
 */

module.exports = (id, toiletId, rating) => {
    validate.string(id, 'id')
    validate.string(toiletId, 'toilet ID')
    validate.type(rating, 'rating', Object)

    return Promise.all([User.findById(id), Toilet.findById({ _id: toiletId }), Comment.findOne({ publisher: id, commentedAt: toiletId })])
        .then(([user, toilet, repeatedComment]) => {

            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)
            if (repeatedComment) throw new NotAllowedError(`user with id ${id} already commented on toilet with id ${toiletId}`)

            if (!rating.textArea) rating.textArea = ''

            const comment = new Comment({ publisher: id, created: new Date, commentedAt: toiletId, rating })

            user.comments.push(comment)
            toilet.comments.push(comment)

            return Promise.all([user.save(), toilet.save(), comment.save()])
        })
        .then(() => { })
}