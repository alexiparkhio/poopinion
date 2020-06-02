require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveUser = require('./retrieve-user')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('retrieveUser', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender, _id
    const GENDERS = ['male', 'female', 'non-binary']

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    describe('when user already exists', () => {

        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender })
                .then(({ id }) => _id = id)
                .then(() => { })
        )

        it('should succeed on correct and valid and right data', () =>
            retrieveUser(_id)
                .then(user => {
                    expect(user.constructor).to.equal(Object)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.email).to.equal(email)
                    expect(user.age).to.equal(age)
                    expect(user.gender).to.equal(gender)
                    expect(user.password).to.be.undefined
                })
                .then(() => { })
        )
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail on a non-existing user', () =>
            retrieveUser(_id)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} does not exist`)
                })
                .then(() => { })
        )
    })

    describe('when the user is deactivated', () => {
        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender, deactivated: true })
                .then(({ id }) => _id = id)
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: true } }))
                .then(() => { })
        )
        it('should fail to retrieve a deactivated user', () =>
            retrieveUser(_id)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
        )
    })

    it('should fail on a non-string id', () => {
        _id = 9328743289
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)

        _id = false
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)

        _id = undefined
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)

        _id = []
        expect(() => retrieveUser(_id)).to.throw(TypeError, `id ${_id} is not a string`)
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})