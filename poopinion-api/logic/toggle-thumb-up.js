const { validate } = require('poopinion-utils')
const { models: { User, Comment } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Adds or removes a thumb-up functionality to a target comment
 * 
 * @param {string} id user's unique id
 * @param {string} commentId comment's unique id
 * 
 * @returns {Promise<string>} returns an empty Promise
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user or the comment do not exist
 */

module.exports = (id, commentId) => {
    validate.string(id, 'id')
    validate.string(commentId, 'comment ID')

    return Promise.all([User.findById(id).lean(), Comment.findById(commentId).lean()])
        .then(([user, comment]) => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!comment) throw new NotFoundError(`comment with id ${commentId} does not exist`)
            
            if (!user.thumbsUp.length) return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $addToSet: { thumbsUp: comment._id.toString() }, $pull: { thumbsDown: comment._id.toString() } }), Comment.findByIdAndUpdate(comment._id.toString(), { $addToSet: { thumbsUp: user._id.toString() }, $pull: { thumbsDown: user._id.toString() } })]).then(() => { })
            
            for (let i = 0; i < user.thumbsUp.length; i++) {
                let tUp = user.thumbsUp[i].toString()
                if (tUp === commentId) return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $pull: { thumbsUp: comment._id.toString() } }), Comment.findByIdAndUpdate(comment._id.toString(), { $pull: { thumbsUp: user._id.toString() } })]).then(() => { })
            }

            return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $addToSet: { thumbsUp: comment._id.toString() }, $pull: { thumbsDown: comment._id.toString() } }), Comment.findByIdAndUpdate(comment._id.toString(), { $addToSet: { thumbsUp: user._id.toString() }, $pull: { thumbsDown: user._id.toString() } })]).then(() => { })
        })
        .then(() => { })
}