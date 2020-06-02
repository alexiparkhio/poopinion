const { validate } = require('poopinion-utils')
const { models: { Toilet } } = require('poopinion-data')

/**
 * Retrieves all toilet posts and then sorts them by their ranking score
 * 
 * @returns {Array} returns an array of all found results
 */

module.exports = () => {
    return Toilet.find().populate('publisher', 'name surname').populate('comments').lean()
        .then(toilets => {
            if (toilets.length > 0) {
                toilets.forEach(toilet => {
                    toilet.score = 0

                    toilet.id = toilet._id.toString()
                    delete toilet._id
                    delete toilet.__v

                    if (typeof toilet.publisher._id !== 'undefined') {
                        toilet.publisher.id = toilet.publisher._id.toString()
                        delete toilet.publisher._id
                    }

                    toilet.comments.length > 0 && toilet.comments.forEach(comment => {
                        comment.id = comment._id.toString()
                        delete comment._id
                        delete comment.__v

                        toilet.score += ((comment.rating.overallRating + (comment.rating.cleanness * 0.5) + (comment.rating.looks * 0.5)) / 2)
                    })

                    toilet.score = parseFloat((toilet.score / toilet.comments.length).toFixed(2))
                })

                return toilets.sort(function (a, b) {
                    return b.score - a.score
                })
            }

            return []
        })
}
