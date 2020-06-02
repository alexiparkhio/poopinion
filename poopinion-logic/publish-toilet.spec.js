require('dotenv').config()

const logic = require('.')
const { publishToilet } = logic
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { random, floor } = Math
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('publishToilet', () => {
    let name, surname, email, password, token, _id, age, gender, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates, image, disabledToilet
    const GENDERS = ['male', 'female', 'non-binary']
    const BOOLEANS = [true, false]

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
        image = `image-${random()}`
        disabledToilet = BOOLEANS[floor(random() * BOOLEANS.length)]
    })

    describe('happy paths', () => {
        it('should succeed on a correct publish', async () => {
            const _password = await bcrypt.hash(password, 10)
            let user = await User.create({ name, surname, email, password: _password, age, gender })
            _id = user.id

            token = await jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            const result = await publishToilet(place, null, disabledToilet, coordinates)
            expect(result).toBeDefined()

            const toilet = await Toilet.findOne({ publisher: _id })
            expect(toilet).toBeDefined()
            expect(toilet.place).toBe(place)
            expect(toilet.disabledToilet).toBe(disabledToilet)
            expect(toilet.publisher.toString()).toBe(_id)
            expect(toilet.geolocation).toBeInstanceOf(Object)
            expect(toilet.geolocation.latitude).toBe(latitude)
            expect(toilet.geolocation.longitude).toBe(longitude)
            expect(toilet.geolocation.latitudeDelta).toBe(latitudeDelta)
            expect(toilet.geolocation.longitudeDelta).toBe(longitudeDelta)
        })

        it('should succeed to publish a new toilet even if no place name has been provided', async () => {
            const _password = await bcrypt.hash(password, 10)
            let user = await User.create({ name, surname, email, password: _password, age, gender })
            _id = user.id

            token = await jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            const result = await publishToilet(undefined, null, disabledToilet, coordinates)
            expect(result).toBeDefined()

            const toilet = await Toilet.findOne({ publisher: _id })
            expect(toilet).toBeDefined()
            expect(toilet.place).toBe('(No place defined)')
            expect(toilet.disabledToilet).toBe(disabledToilet)
            expect(toilet.publisher.toString()).toBe(_id)
            expect(toilet.geolocation).toBeInstanceOf(Object)
            expect(toilet.geolocation.latitude).toBe(latitude)
            expect(toilet.geolocation.longitude).toBe(longitude)
            expect(toilet.geolocation.latitudeDelta).toBe(latitudeDelta)
            expect(toilet.geolocation.longitudeDelta).toBe(longitudeDelta)
        })

        it('should fail to auth if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })
            let _error

            try {
                await publishToilet(place, image, disabledToilet, coordinates)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to retrieve a non-existant user', async () => {
            await User.deleteMany()
            let _error
            try {
                await publishToilet(place, image, disabledToilet, coordinates)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non boolean disabledToilet', () => {
            place = 'someplace'
            
            disabledToilet = 45438
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`disabledToilet ${disabledToilet} is not a boolean`)
           
            disabledToilet = 'sasasas'
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`disabledToilet ${disabledToilet} is not a boolean`)
            
            disabledToilet = []
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`disabledToilet ${disabledToilet} is not a boolean`)
            
            disabledToilet = undefined
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`disabledToilet ${disabledToilet} is not a boolean`)
        })

        it('should fail on a non object coordinates', () => {
            place = 'someplace'
            disabledToilet = true

            coordinates = 45438
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`coordinates ${coordinates} is not a Object`)
           
            coordinates = 'sasasas'
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`coordinates ${coordinates} is not a Object`)
            
            coordinates = false
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`coordinates ${coordinates} is not a Object`)
            
            coordinates = undefined
            expect(() => publishToilet(place, image, disabledToilet, coordinates)).toThrow(`coordinates ${coordinates} is not a Object`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await mongoose.disconnect()
    })
})