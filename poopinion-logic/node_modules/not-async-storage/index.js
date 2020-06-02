let context = {}

module.exports = {
    get __context__() {
        return context
    },

    async setItem(key, value) {
        if (typeof key !== 'string') throw new TypeError(`key ${key} is not a string`)
        if (typeof value !== 'string') throw new TypeError(`value ${value} is not a string`)

        context[key] = value
    },

    async getItem(key) {
        if (typeof key !== 'string') throw new TypeError(`key ${key} is not a string`)

        return context[key]
    },

    async removeItem(key) {
        if (typeof key !== 'string') throw new TypeError(`key ${key} is not a string`)

        delete context[key]
    },

    async clear() {
        context = {}
    }
}