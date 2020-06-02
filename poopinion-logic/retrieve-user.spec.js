require('dotenv').config()

const { random, floor } = Math

const logic = require('.')
const { retrieveUser } = logic
const { mongoose, models: { User } } = require('poopinion-data')
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { NotFoundError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('retrieveUser', () => {
    beforeAll(() =>
        mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, email, password, age, gender, token, _id
    const GENDERS = ['male', 'female', 'non-binary']

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    describe('happy paths', () => {
        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, email, password: _password, age, gender })
                .then(user => {
                    _id = user.id
                    return user.id
                })
                .then(id => {
                    token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: '1d' })

                    return logic.__context__.storage.setItem('token', token)
                })
                .then(() => { })
        })

        it('should succeed on correct and valid and right data', async () => {
            const user = await retrieveUser()

            expect(user).toBeDefined()
            expect(user.name).toBe(name)
            expect(user.surname).toBe(surname)
            expect(user.email).toBe(email)
            expect(user.age).toBe(age)
            expect(user.gender).toBe(gender)
            expect(user.password).toBeUndefined()
        })

        it('should fail to retrieve a non-existant user', async () => {

            await User.deleteMany()

            let _error

            try {
                const user = await retrieveUser()

            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)

            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })

        it('should fail to auth if the user is deactivated', async () => {
            await logic.__context__.storage.clear()
            const _password = await bcrypt.hash(password, 10)
            await User.create({ name, surname, email: `second-${email}`, password: _password, age, gender })
                .then(user => _id = user.id)
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: true } }))
                .then(() => {
                    token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })

                    return logic.__context__.storage.setItem('token', token)
                })
                .then(() => { })

            let _error

            try {
                const user = await retrieveUser()
               
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })
    })

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})