require('dotenv').config()

const logic = require('.')
const { retrieveToilet } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotFoundError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('retrieveToilet', () => {
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
        it('should successfully retrieve the toilet details', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let _toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = _toilet.id

            const toilet = await retrieveToilet(_toiletId)

            expect(toilet).toBeDefined()
            expect(toilet).toBeInstanceOf(Object)
            expect(toilet.comments).toBeInstanceOf(Array)
            expect(toilet.publisher.id.toString()).toMatch(_id)
            expect(toilet.place).toMatch(place)
            expect(toilet.id.toString()).toMatch(_toiletId)

        })

        it('should fail to retrieve any favorite toilets if the user does not exist', async () => {
            await Toilet.deleteMany()

            let _error
            try {
                await retrieveToilet(_toiletId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`toilet with id ${_toiletId} does not exist`)
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non string toilet ID', () => {
            let toiletId = 45438
            expect(() => retrieveToilet(toiletId)).toThrow(`toiletId ${toiletId} is not a string`)

            toiletId = {}
            expect(() => retrieveToilet(toiletId)).toThrow(`toiletId ${toiletId} is not a string`)

            toiletId = false
            expect(() => retrieveToilet(toiletId)).toThrow(`toiletId ${toiletId} is not a string`)

            toiletId = [1, 2, 3]
            expect(() => retrieveToilet(toiletId)).toThrow(`toiletId ${toiletId} is not a string`)

            toiletId = undefined
            expect(() => retrieveToilet(toiletId)).toThrow(`toiletId is empty`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await mongoose.disconnect()
    })
})