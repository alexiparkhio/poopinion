const { retrieveTopToilets } = require('../../logic')

module.exports = (req, res) => {

    try {
        retrieveTopToilets()
            .then(toilets =>
                res.status(200).json(toilets)
            )
            .catch(error => {
                let status = 400

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        res
            .status(status)
            .json({
                error: message
            })
    }
}