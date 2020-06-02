const fs = require('fs')
const { saveToiletPhoto } = require('../../logic')
const Busboy = require('busboy')

module.exports = (req, res) => {
    const { payload: { sub: userId }, params: { toiletId } } = req

    const busboy = new Busboy({ headers: req.headers })

    try {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

            filename = 'toilet01'
            saveToiletPhoto(userId, toiletId, file, filename)
        })

        busboy.on('finish', () => {
            res.send('uploaded');
        })

        req.pipe(busboy)
    } catch (error) {
        let status = 400

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof TypeError)
            status = 406 // not acceptable

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }

}