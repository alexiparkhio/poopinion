const { validate } = require('poopinion-utils')
const { models: { User, Toilet } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

/**
 * Adds the specific toilet post on favToilets array of specific user. Removes it if it's already on favToilets array
 * 
 * @param {string} id user's unique id
 * @param {string} toiletId toilet's unique id
 * 
 * @returns {Promise<string>} returns an empty Promise
 * 
 * @throws {NotAllowedError} if the user exists but has the property 'deactivated' as true
 * @throws {NotFoundError} if the user or the toilet do not exis
 */

module.exports = (id, toiletId) => {
    validate.string(id, 'id')
    validate.string(toiletId, 'toilet ID')

    return Promise.all([User.findById(id).lean(), Toilet.findById(toiletId).lean()])
        .then(([user, toilet]) => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)
            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)
            
            if (!user.favToilets.length) return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $addToSet: { favToilets: toilet._id.toString() } }), Toilet.findByIdAndUpdate(toilet._id.toString(), { $addToSet: { isFavedBy: user._id.toString() } })]).then(() => { })
            
            for (let i = 0; i < user.favToilets.length; i++) {
                let fav = user.favToilets[i].toString()
                if (fav === toiletId) return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $pull: { favToilets: toilet._id.toString() } }), Toilet.findByIdAndUpdate(toilet._id.toString(), { $pull: { isFavedBy: user._id.toString() } })]).then(() => { })
            }

            return Promise.all([User.findByIdAndUpdate(user._id.toString(), { $addToSet: { favToilets: toilet._id.toString() } }), Toilet.findByIdAndUpdate(toilet._id.toString(), { $addToSet: { isFavedBy: user._id.toString() } })]).then(() => { })
        })
        .then(() => { })
}