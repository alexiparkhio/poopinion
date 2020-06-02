require('dotenv').config()

const logic = require('.')
const { retrieveTopToilets } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL } = process.env
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { random, floor } = Math
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('retrieveTopToilets', () => {
    let name, surname, email, password, age, gender, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates, rating = {}
    const GENDERS = ['male', 'female', 'non-binary']

    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
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
        rating = {
            cleanness: floor(random() * 5),
            looks: floor(random() * 5),
            multipleToilets: floor(random() * 2),
            paperDeployment: floor(random() * 2),
            paymentRequired: floor(random() * 2),
            overallRating: floor(random() * 5),
            textArea: `opinion-${random()}`
        }
    })

    describe('happy paths', () => {
        it('should successfully retrieve all toilets and sort them by score', async () => {
            let user

            user = await User.create({ name, surname, email, password, age, gender });

            for (let i = 0; i < 10; i++) {
                const publisher = user.id, place = `home of -${i}`
                const toilet = await Toilet.create({ publisher, place, image: undefined, geolocation: coordinates })
                const commentedAt = toilet.id
                const comment = await Comment.create({ publisher, commentedAt, rating })

                user.comments.push(comment)
                toilet.comments.push(comment)

                await user.save()
                await toilet.save()
            }

            const toilets = await retrieveTopToilets()

            expect(toilets).toBeInstanceOf(Array)
            expect(toilets.length).toBe(10)

            toilets.forEach((toilet, index) => {
                expect(toilet).toBeInstanceOf(Object)
                if (index === toilets.length-1) {
                    expect(toilet.score).toBeLessThanOrEqual(toilets[index-1].score)
                } else {
                    expect(toilet.score).toBeGreaterThanOrEqual(toilets[index + 1].score)
                }
            })
        })

        it('should successfully retrieve an empty array if no toilets exist', async () => {
            await Toilet.deleteMany()
            const toilets = await retrieveTopToilets()

            expect(toilets).toBeInstanceOf(Array)
            expect(toilets.length).toBe(0)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
        await mongoose.disconnect()
    })
})