require('dotenv').config()

const logic = require('.')
const { publishComment } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotAllowedError, NotFoundError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('publishComment', () => {
    let name, surname, email, password, age, gender, place, latitude, rating, longitude, latitudeDelta, longitudeDelta, coordinates, _id, _toiletId, token, _commentId
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
        it('should successfully publish a new comment on a toilet post', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            let comment = await publishComment(_toiletId, { rating })

            expect(comment).toBeUndefined()
            comment = await Comment.findOne({ publisher: _id, commentedAt: _toiletId }).lean()

            expect(comment).toBeDefined()
            expect(comment).toBeInstanceOf(Object)
            expect(comment.publisher.toString()).toMatch(_id)
            expect(comment.commentedAt.toString()).toMatch(_toiletId)
            expect(comment.rating).toBeInstanceOf(Object)
            expect(comment.rating.cleanness).toBe(rating.cleanness)
            expect(comment.rating.looks).toBe(rating.looks)
            expect(comment.rating.multipleToilets).toBe(rating.multipleToilets)
            expect(comment.rating.paperDeployment).toBe(rating.paperDeployment)
            expect(comment.rating.paymentRequired).toBe(rating.paymentRequired)
            expect(comment.rating.overallRating).toBe(rating.overallRating)
            expect(comment.rating.textArea).toMatch(rating.textArea)

            user = await User.findById(_id).lean()
            toilet = await Toilet.findById(_toiletId).lean()

            expect(user.comments.length).toBe(1)
            expect(user.comments[0].toString()).toMatch(comment._id.toString())
            expect(toilet.comments.length).toBe(1)
            expect(toilet.comments[0].toString()).toMatch(comment._id.toString())
        })

        it('should fail to add a comment if one was already made by the user', async () => {
            let _error
            try {
                await publishComment(_toiletId, { rating })
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toMatch(`user with id ${_id} already commented on toilet with id ${_toiletId}`)
        })

        it('should fail to publish the comment if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })
            let _error

            try {
                await publishComment(_toiletId, { rating })
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotAllowedError)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to publish a comment on a non-existant user', async () => {
            await User.deleteMany()
            let _error
            try {
                await publishComment(_toiletId, { rating })
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })

        it('should fail to publish the comment if the toilet does not exist', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            await Toilet.deleteMany()

            let _error
            try {
                await publishComment(_toiletId, { rating })
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
            _toiletId = 45438
            expect(() => publishComment(_toiletId, { rating })).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = {}
            expect(() => publishComment(_toiletId, { rating })).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => publishComment(_toiletId, { rating })).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = [1, 2, 3]
            expect(() => publishComment(_toiletId, { rating })).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => publishComment(_toiletId, { rating })).toThrow(`toiletId is empty`)
        })

        it('should fail on a non object rating', () => {
            _toiletId = 'sometoiletId'
            rating = 45438
            expect(() => publishComment(_toiletId, rating)).toThrow(`rating ${rating} is not a Object`)

            rating = 'sasasas'
            expect(() => publishComment(_toiletId, rating)).toThrow(`rating ${rating} is not a Object`)

            rating = false
            expect(() => publishComment(_toiletId, rating)).toThrow(`rating ${rating} is not a Object`)

            rating = undefined
            expect(() => publishComment(_toiletId, rating)).toThrow(`rating ${rating} is not a Object`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
        await mongoose.disconnect()
    })
})