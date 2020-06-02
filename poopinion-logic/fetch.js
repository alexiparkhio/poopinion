const _fetch = require('node-fetch')
const { NotFoundError, NotAllowedError } = require('poopinion-errors')

module.exports = {
    post: function (url, body, token = undefined) {
        return (async () => {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body instanceof Object ? body : { body })
            }

            if (token) options.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

            const response = await _fetch(url, options)

            const { status } = response

            if (status === 201) return

            if (status >= 400 && status < 500) {
                const { error } = await response.json()

                if (status === 404) throw new NotFoundError(error)

                if (status === 409) throw new NotAllowedError(error)

                throw new Error(error)
            }

            throw new Error('server error')
        })()
    },

    get: function (url, token = undefined) {
        return (async () => {
            const options = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            if (token) options.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

            const response = await _fetch(url, options)

            const { status } = response

            if (status === 200) {
                const results = await response.json()
                return results
            }

            if (status >= 400 && status < 500) {
                const { error } = await response.json()

                if (status === 404) throw new NotFoundError(error)

                if (status === 409) throw new NotAllowedError(error)

                throw new Error(error)
            }

            throw new Error('server error')
        })()
    },

    patch: async function (url, body, token = undefined) {
        return (async () => {
            const options = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body instanceof Object ? body : { body })
            }

            if (token) options.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

            const response = await _fetch(url, options)

            const { status } = response

            if (status === 200) return
            if (status >= 400 && status < 500) {
                const { error } = await response.json()

                if (status === 404) throw new NotFoundError(error)

                if (status === 409) throw new NotAllowedError(error)

                throw new Error(error)
            }

            throw new Error('server error')
        })()
    },

    delete: function (url, token = undefined) {
        return (async () => {
            const options = {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' }
            }
            if (token) options.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

            const response = await _fetch(url, options)
            const { status } = response

            if (status === 200) return
            if (status >= 400 && status < 500) {
                const { error } = await response.json()

                if (status === 404) throw new NotFoundError(error)

                if (status === 409) throw new NotAllowedError(error)

                throw new Error(error)
            }

            throw new Error('server error')
        })()
    }
}