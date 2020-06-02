const { publishToilet } = require('../../logic')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')

module.exports = (req, res) => {
    const { body: { place, disabledToilet, coordinates }, payload: { sub: id } } = req

    try {
        publishToilet(id, place, disabledToilet, coordinates)
            .then(toiletId => res.status(201).json({ toiletId }))
            .catch(error => {
                let status = 400

                if (error instanceof NotFoundError)
                    status = 404

                if (error instanceof NotAllowedError)
                    status = 409 // conflict

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