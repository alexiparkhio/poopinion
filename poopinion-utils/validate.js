const { ContentError } = require('poopinion-errors')
const isValidDate = require('./is-valid-date')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    string(target, name, empty = true) {
        this.type(target, name, String)

        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    stringFrontend(target, name, empty = true) {
        if (typeof target === 'undefined') throw new ContentError(`${name} is empty`)

        this.type(target, name, String)

        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    age(target) {
        if (!isValidDate(target)) throw new ContentError(`${target} is not a valid date of birth`)
        const [year, month, day] = target.split('-')
        if (!isValidDate(target) || Number(year) >= new Date().getFullYear() || Number(month) > 12 || Number(day) > 31) throw new ContentError(`${target} is not a valid date of birth`)
    },

    email(target) {
        if (!EMAIL_REGEX.test(target)) throw new ContentError(`${target} is not an e-mail`) // TODO custom error?
    },

    gender(target) {
        const GENDERS = ['male', 'female', 'non-binary']
        if (!GENDERS.includes(target)) throw new ContentError(`${target} is not included on the gender list`)
    },

    type(target, name, type) {
        if (type === String || type === Number || type === Boolean) {
            type = type.name.toLowerCase()
            if (typeof target === 'number' && target.toString() === 'NaN') throw new TypeError(`${name} ${target} is not a ${type}`)
            if (typeof target !== type) throw new TypeError(`${name} ${target} is not a ${type}`)
        } else if (!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
    }
}