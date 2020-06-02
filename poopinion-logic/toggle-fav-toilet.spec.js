require('dotenv').config()

const logic = require('.')
const { toggleFavToilet } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotFoundError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('toggleFavToilet', () => {
    let name, surname, email, password, age, gender, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates, _id, _toiletId, token
    const GENDERS = ['male', 'female', 'non-binary']

    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
        await Toilet.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 100)
        gender = GENDERS[floor(random() * GENDERS.length)]
        place = `place-${random()}`
        latitudeDelta = random()
        longitudeDelta = random()
        latitude = random()
        longitude = random()
        coordinates = { latitude, longitude, latitudeDelta, longitudeDelta }
    })

    describe('happy paths', () => {
        it('should successfully toggle/untoggle the toilet to favorites', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            const toggle = await toggleFavToilet(_toiletId)
            expect(toggle).toBeUndefined()

            toilet = await Toilet.findById(_toiletId)
            user = await User.findById(_id).lean()

            expect(toilet.isFavedBy).toBeInstanceOf(Array)
            expect(toilet.isFavedBy.length).toBe(1)
            expect(toilet.isFavedBy[0].toString()).toMatch(_id)

            expect(user.favToilets).toBeInstanceOf(Array)
            expect(user.favToilets.length).toBe(1)
            expect(user.favToilets[0].toString()).toMatch(_toiletId)

            const untoggle = await toggleFavToilet(_toiletId)
            expect(untoggle).toBeUndefined()

            toilet = await Toilet.findById(_toiletId)
            user = await User.findById(_id).lean()

            expect(toilet.isFavedBy).toBeInstanceOf(Array)
            expect(toilet.isFavedBy.length).toBe(0)

            expect(user.favToilets).toBeInstanceOf(Array)
            expect(user.favToilets.length).toBe(0)
        })

        it('should fail to toggle/untoggle if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })

            let _error

            try {
                await toggleFavToilet(_toiletId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to toggle favs if the user does not exist', async () => {
            await User.deleteMany()

            let _error
            try {
                await toggleFavToilet( _toiletId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })

        it('should fail to toggle favs if the toilet does not exist', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            await Toilet.deleteMany()

            let _error
            try {
                await toggleFavToilet(_toiletId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`toilet with id ${_toiletId} does not exist`)
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non-string toilet ID', () => {
            _toiletId = 45438
            expect(() => toggleFavToilet(_toiletId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = {}
            expect(() => toggleFavToilet(_toiletId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => toggleFavToilet(_toiletId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = [1, 2, 3]
            expect(() => toggleFavToilet(_toiletId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => toggleFavToilet(_toiletId)).toThrow(`toiletId is empty`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await mongoose.disconnect()
    })
})