require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { expect } = require('chai')
const { random, floor } = Math
const authenticateUser = require('./authenticate-user')
const bcrypt = require('bcryptjs')
const { ContentError } = require('poopinion-errors')

describe('authenticateUser', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender
    const GENDERS = ['male', 'female', 'non-binary']

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 120)
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    describe('when user already exists', () => {
        let _id
        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, email, password, age, gender })
                )
                .then(user => _id = user.id)
        )

        it('should succeed on correct and valid and right credentials', () =>
            authenticateUser(email, password)
                .then(id => {
                    expect(id).to.be.a('string')
                    expect(id.length).to.be.greaterThan(0)
                    expect(id).to.equal(_id)
                })
        )

        it('should fail on incorrect credentials', () => {
            authenticateUser(`wrong-${email}`, password)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal('wrong credentials')
                })

            authenticateUser(email, `${password}-wrong`)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal('wrong credentials')
                })
        })
    })

    describe('when the user is deactivated', () => {
        let _id
        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender })
                .then(({ id }) => _id = id)
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: true } }))
                .then(() => { })
        )

        it('should fail to auth if the user is deactivated', () =>
            authenticateUser(email, password)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
                .then(() => { })
        )
    })

    describe('unhappy paths', () => {

        it('should fail on a non-string and non-valid email', () => {
            email = 9328743289
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)

            email = false
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)

            email = undefined
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)

            email = []
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `email ${email} is not a string`)

            email = 'kfjsnfksdn'
            expect(() => authenticateUser(email, password)).to.throw(ContentError, `${email} is not an e-mail`)

            email = 'kfjsnfksdn@123'
            expect(() => authenticateUser(email, password)).to.throw(ContentError, `${email} is not an e-mail`)
        })

        it('should fail on a non-string password', () => {
            password = 9328743289
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)

            password = false
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)

            password = undefined
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)

            password = []
            expect(() => authenticateUser(email, password)).to.throw(TypeError, `password ${password} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})