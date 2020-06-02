const { searchToilets } = require('../../logic')
const { NotFoundError, NotAllowedError } = require('poopinion-errors')

module.exports = (req, res) => {
    const { query: { q: query } } = req

    try {
        searchToilets(query)
            .then(toilets =>
                res.status(200).json(toilets)
            )
            .catch(error => {
                let status = 400
                if (error instanceof NotAllowedError)
                    status = 401

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