const { validate } = require('poopinion-utils')
const fetch = require('node-fetch')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const context = require('./context')

/**
 * Publishes a new toilet post
 * 
 * @param {string} place the place's name of the toilet
 * @param {string} image URI of the toilet's image
 * @param {boolean} disabledToilet if the place have a disabled toilet available
 * @param {Object} coordinates google maps coordinates
 * 
 * @returns {undefined} on a successful publish
 * 
 * @throws {NotAllowedError} on wrong credentials or deactivated user
 * @throws {NotFoundError} on non-existent user
 */

module.exports = function (place = '(No place defined)', image, disabledToilet, coordinates) {
    validate.stringFrontend(place, 'place')
    validate.type(disabledToilet, 'disabledToilet', Boolean)
    validate.type(coordinates, 'coordinates', Object)

    return (async () => {
        const token = await this.storage.getItem('token')
        const response = await fetch(`${this.API_URL}/users/toilet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ place, disabledToilet, coordinates })
        })

        const { status } = response

        if (status === 201) {
            const { toiletId } = await response.json()

            const userResponse = await fetch(`${this.API_URL}/users`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            })

            const user = await userResponse.json()

            const toilet = user.publishedToilets.find(toilet => toilet.place === place)

            if (image !== null) {
                let form = new FormData()
                form.append('image', {
                    uri: image,
                    type: 'image/jpeg',
                    name: 'toilet01',
                })

                const imageResponse = await fetch(`${this.API_URL}/upload/${toilet.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
                    body: form
                })

                const { status } = imageResponse

                if (status === 200) {
                    const image = { image: `${this.API_URL}/load/${toilet.id}` }

                    const updateImage = await fetch(`${this.API_URL}/users/toilet/${toilet.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify(image)
                    })

                    const { status } = updateImage
                    
                    if (status === 200) return toiletId
                }

                if (status >= 400 && status < 500) {
                    const { error } = await imageResponse.json()

                    if (status === 409) {
                        throw new NotAllowedError(error)
                    }

                    if (status === 404) {
                        throw new NotFoundError(error)
                    }

                    throw new Error(error)
                }
            } else return toiletId
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 409) {
                throw new NotAllowedError(error)
            }

            if (status === 404) {
                throw new NotFoundError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}.bind(context)