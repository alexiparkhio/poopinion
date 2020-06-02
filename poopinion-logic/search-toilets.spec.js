require('dotenv').config()

const logic = require('.')
const { searchToilets } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL } = process.env
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { random, floor } = Math
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('searchToilets', () => {
    let name, surname, email, password, age, gender, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates
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
        it('should successfully retrieve all toilets that match the query "home"', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });

            for (let i = 0; i < 5; i++) {
                const publisher = user.id, place = `home of -${i}`
                await Toilet.create({ publisher, place })
            }

            let query = 'home of'
            const toilets = await searchToilets(query)

            expect(toilets).toBeInstanceOf(Array)
            expect(toilets.length).toBe(5)

            toilets.forEach((toilet, index) => {
                expect(toilet).toBeInstanceOf(Object)
                const { place } = toilet
                expect(place).toMatch(`home of -${index}`)
            })
        })

        it('should successfully retrieve all toilets that match the query "house"', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });

            for (let i = 0; i < 5; i++) {
                const publisher = user.id, place = `house of -${i}`
                await Toilet.create({ publisher, place })
            }

            let query = 'house of'
            const toilets = await searchToilets(query)

            expect(toilets).toBeInstanceOf(Array)
            expect(toilets.length).toBe(5)

            toilets.forEach((toilet, index) => {
                expect(toilet).toBeInstanceOf(Object)
                const { place } = toilet
                expect(place).toMatch(`house of -${index}`)
            })
        })

        it('should successfully retrieve an empty array if no toilet meets the query criteria', async () => {
            const toilets = await searchToilets('somerandomandwrongquery')

            expect(toilets).toBeInstanceOf(Array)
            expect(toilets.length).toBe(0)
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non string query', () => {
            query = 45438
            expect(() => searchToilets(query)).toThrow(`query ${query} is not a string`)

            query = {}
            expect(() => searchToilets(query)).toThrow(`query ${query} is not a string`)

            query = false
            expect(() => searchToilets(query)).toThrow(`query ${query} is not a string`)

            query = [1, 2, 3]
            expect(() => searchToilets(query)).toThrow(`query ${query} is not a string`)

            query = undefined
            expect(() => searchToilets(query)).toThrow(`query is empty`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await mongoose.disconnect()
    })
})