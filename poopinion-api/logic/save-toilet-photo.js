require('dotenv').config()
const { validate } = require('poopinion-utils')
const { NotFoundError } = require('poopinion-errors')
const { models: { User, Toilet } } = require('poopinion-data')
const fs = require('fs')
const path = require('path')

/**
* Saves toilet(s) image
* 
* @param {string} userId user's unique id
* @param {string} toiletId toilet's unique id
* @param {Stream} file data of the image
* @param {string} filename name of the image
*
* @returns {Promise} returns an empty promise on a successful upload  
*/

module.exports = function (userId, toiletId, file, filename) {
    validate.string(userId, 'userId')
    validate.string(toiletId, 'toiletId')
    validate.string(filename, 'filename')

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)
        if (user.deactivated) throw new NotFoundError(`user with id ${id} is deactivated`)

        const toilet = await Toilet.findById(toiletId)
        if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)

        const dir = `./data/toilets/${toiletId}`
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)

        let saveTo = path.join(__dirname, `../data/toilets/${toiletId}/${filename}.jpg`)
        file.pipe(fs.createWriteStream(saveTo))
    })()
}