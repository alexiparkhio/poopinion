const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')
const { validate } = require('poopinion-utils')
const { models: { User, Toilet, Comment } } = require('poopinion-data')
const { NotFoundError } = require('poopinion-errors')

/**
 * Deletes a toilet picture
 * 
 * @param {string} toiletId toilet's unique id
 * 
 * @returns {Promise<string>} returns an empty Promise on a successful delete
 * 
 * @throws {NotFoundError} if the the toilet does not exist
 */

module.exports = (toiletId) => {
    validate.string(toiletId, 'toilet ID')

    return Toilet.findById(toiletId)
        .then(toilet => {
            if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)

            const dir = `./data/toilets/${toiletId}`

            if (fs.existsSync(dir)) {
                let deletePath = path.join(__dirname, `../data/toilets/${toiletId}`)
                return rimraf.sync(deletePath)
            } else return
        })
}