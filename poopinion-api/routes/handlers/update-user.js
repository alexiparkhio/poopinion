const { updateUser } = require('../../logic')
const { NotFoundError, NotAllowedError } = require('poopinion-errors')

module.exports = (req, res) => {
    let { payload: { sub: id }, body } = req
    const { password } = body
    delete body.password

    try {
        updateUser(id, body, password)
            .then(() =>
                res.status(200).end()
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