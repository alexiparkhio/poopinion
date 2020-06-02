require('dotenv').config()

const { random, floor } = Math
const { mongoose, models: { User } } = require('poopinion-data')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const logic = require('.')
const { authenticateUser } = logic
const bcrypt = require('bcryptjs')
const atob = require('atob')
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('authenticateUser', () => {
    beforeAll(() =>
        mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, email, password
    const GENDERS = ['male', 'female', 'non-binary']

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, email, password: _password, age, gender })
                .then(user => _id = user.id)
        })

        it('should succeed on correct and valid and right credentials', async () => {

            await authenticateUser(email, password)

            const token = await logic.__context__.storage.getItem('token')

            expect(token).toBeDefined()
            expect(token.length).toBeGreaterThan(0)
            expect(typeof token).toEqual('string')

            const sub = JSON.parse(atob(token.split('.')[1])).sub

            expect(sub).toEqual(_id)
        })

        it('should fail to auth on wrong email', async () => {
            let _error
            try {
                await authenticateUser(`wrong-${email}`, password)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual('wrong credentials')
        })

        it('should fail to auth on wrong password', async () => {
            let _error
            try {
                await authenticateUser(email, `${password}-wrong`)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual('wrong credentials')
        })

        afterEach(() => User.deleteMany().then(() => { }))
    })

    describe('when the user is deactivated', () => {
        logic.__context__.storage.getIte
        let _id
        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, email, password: _password, age, gender })
                .then(user => _id = user.id)
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: true } }))
                .then(() => { })
        })

        it('should fail to auth if the user is deactivated', async () => {
            let _error

            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })
    })

    describe('unhappy paths', () => {

        it('should fail on a non string email', async () => {
            let _error
            email = 45438
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
            email = false
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
            email = undefined
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email is empty`)
            email = []
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
        })

        it('should fail on a non valid email address', async () => {
            let _error
            email = 'asjdvsdhjv'
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)
            email = '123@a'
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)
        })

        it('should fail on a non string password', async () => {
            let _error
            password = 45438
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = false
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = undefined
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password is empty`)
            password = []
            try {
                await authenticateUser(email, password)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
        })
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})