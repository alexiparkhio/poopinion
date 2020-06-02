const { retrieveToilet } = require('../../logic')
const { NotFoundError, NotAllowedError } = require('poopinion-errors')

module.exports = (req, res) => {
    const { params: { toiletId } } = req

    try {
        retrieveToilet(toiletId)
            .then(toilet =>
                res.status(200).json(toilet)
            )
            .catch(error => {
                let status = 400

                switch (true) {
                    case error instanceof NotFoundError:
                        status = 404 // not found
                        break
                    case error instanceof NotAllowedError:
                        status = 403 // forbidden
                }
        
                const { message } = error
        
                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        switch (true) {
            case error instanceof NotFoundError:
                status = 404 // not found
                break
            case error instanceof NotAllowedError:
                status = 403 // forbidden
        }

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}