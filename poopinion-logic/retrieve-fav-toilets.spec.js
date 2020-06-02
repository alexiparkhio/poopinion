require('dotenv').config()

const logic = require('.')
const { retrieveFavToilets } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotFoundError, NotAllowedError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('retrieveFavToilets', () => {
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
        it('should successfully retrieve the favorited toilets', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            await User.findByIdAndUpdate(_id, { $push: { favToilets: _toiletId } })
            await Toilet.findByIdAndUpdate(_toiletId, { $push: { isFavedBy: _id } })

            const favToilets = await retrieveFavToilets()
            expect(favToilets).toBeDefined()
            expect(favToilets).toBeInstanceOf(Array)
            expect(favToilets[0]).toBeInstanceOf(Object)
            expect(favToilets[0].publisher.id.toString()).toMatch(_id)
            expect(favToilets[0].isFavedBy[0].toString()).toMatch(_id)
            expect(favToilets[0].id.toString()).toMatch(_toiletId)

            user = await User.findById(_id).lean()

            expect(user.favToilets).toBeDefined()
            expect(user.favToilets).toBeInstanceOf(Array)
            expect(user.favToilets[0].toString()).toMatch(_toiletId)
        })

        it('should fail to retrieve any toilets if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })

            let _error

            try {
                await retrieveFavToilets()
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to retrieve any favorite toilets if the user does not exist', async () => {
            await User.deleteMany()

            let _error
            try {
                await retrieveFavToilets(token)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await mongoose.disconnect()
    })
})