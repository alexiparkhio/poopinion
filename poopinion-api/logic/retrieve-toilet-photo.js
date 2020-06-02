require('dotenv').config()
const { validate } = require('poopinion-utils')
const { NotFoundError } = require('poopinion-errors')
const { ObjectId, models: { Toilet } } = require('poopinion-data')
const fs = require('fs')
const path = require('path')

/**
* Retrieves toilet's unique picture
* 
* @param {ObjectId} toiletId toilet's unique ID
* @returns {Promise} - data of the image  
*/

module.exports = function (toiletId) {
    validate.string(toiletId, 'toiletId')

    return (async () => {
        const toilet = await Toilet.findById(toiletId)
        if (!toilet) throw new NotFoundError(`toilet with id ${toiletId} does not exist`)

        let goTo = path.join(__dirname, `../data/toilets/${toiletId}/toilet01.jpg`)

        if (fs.existsSync(goTo)) {
            return fs.createReadStream(goTo)
        } else {
            const defaultImage = path.join(__dirname, `../data/defaultimage/avatar00.jpg`)
            return fs.createReadStream(defaultImage)
        }
    })()
}