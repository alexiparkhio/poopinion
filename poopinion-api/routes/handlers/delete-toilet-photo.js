const { deleteToiletPhoto } = require('../../logic')
const { NotFoundError } = require('poopinion-errors')

module.exports = (req, res) => {
    const { params: { toiletId } } = req

    try {
        deleteToiletPhoto(toiletId)
            .then(() => res.status(200).end())
            .catch(error => {
                let status = 400

                if (error instanceof NotFoundError)
                    status = 404

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof NotFoundError)
            status = 404

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}