const { retrieveToiletPhoto } = require('../../logic')
const fs = require('fs')

module.exports = async (req, res) => {
    const { params: { toiletId } } = req

    const stream = await retrieveToiletPhoto(toiletId)

    stream.on('open', () => {
        stream.pipe(res)
    })
}