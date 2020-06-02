const { validate } = require('poopinion-utils')
const { models: { User, Toilet, Comment } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Deletes a toilet post and removes its track from both users and comments
 * 
 * @param {string} id user's unique id
 * @param {string} toiletId toilet's unique id
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful delete
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user or the toilet do not exist
 */

module.exports = (id, toiletId) => {
    validate.string(id, 'id')
    validate.string(toiletId, 'toilet ID')

    return Promise.all([User.findById(id), Toilet.findById(toiletId).populate('comments', 'publisher')])
        .then(([user, toilet]) => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)

            return Promise.resolve(toilet.comments.forEach(comment => {
                const oneId = comment.id
                User.find({ comments: comment.id })
                    .then(users => users.forEach(user => Promise.resolve(User.findByIdAndUpdate(user.id, { $pull: { comments: oneId } }))))
            }))
        })
        .then(() => Comment.find({ commentedAt: toiletId }))
        .then(commentsArray => commentsArray.forEach(comment => Promise.resolve(Comment.findByIdAndRemove(comment.id))))
        .then(() => User.find({ favToilets: toiletId }))
        .then(users => {
            users.forEach(user => {
                Promise.resolve(User.findByIdAndUpdate(user.id, { $pull: { favToilets: toiletId } }))
            })
        })
        .then(() => User.findByIdAndUpdate(id, { $pull: { publishedToilets: toiletId, favToilets: toiletId } }))
        .then(() => Toilet.findByIdAndRemove(toiletId))
        .then(() => { })
}