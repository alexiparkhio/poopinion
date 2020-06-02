require('dotenv').config()

const logic = require('.')
const { toggleThumbDown } = logic
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotFoundError } = require('poopinion-errors')
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('toggleThumbDown', () => {
    let name, surname, email, password, age, gender, place, latitude, rating, longitude, latitudeDelta, longitudeDelta, coordinates, _id, _toiletId, _commentId, token
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

        it('should successfully toggle/untoggle a thumb down on a comment made in a toilet post', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id
            let comment = await Comment.create({ place, publisher: _id, commentedAt: _toiletId, rating })
            _commentId = comment.id

            await User.findByIdAndUpdate(_id, { $push: { comments: _commentId } })
            await Toilet.findByIdAndUpdate(_toiletId, { $push: { comments: _commentId } })

            const toggle = await toggleThumbDown(_commentId)
            expect(toggle).toBeUndefined()

            toilet = await Toilet.findById(_toiletId).populate('comments')
            user = await User.findById(_id).lean()

            expect(toilet.comments).toBeInstanceOf(Array)
            expect(toilet.comments.length).toBe(1)
            expect(toilet.comments[0].publisher.toString()).toMatch(_id)
            expect(toilet.comments[0].thumbsDown).toBeInstanceOf(Array)
            expect(toilet.comments[0].thumbsDown.length).toBe(1)
            expect(toilet.comments[0].thumbsDown[0].toString()).toMatch(_id)

            expect(user.comments).toBeInstanceOf(Array)
            expect(user.comments.length).toBe(1)
            expect(user.thumbsDown).toBeInstanceOf(Array)
            expect(user.thumbsDown.length).toBe(1)
            expect(user.thumbsDown[0].toString()).toMatch(_commentId)

            comment = await Comment.findById(_commentId).lean()

            expect(comment.thumbsDown).toBeInstanceOf(Array)
            expect(comment.thumbsDown.length).toBe(1)
            expect(comment.thumbsDown[0].toString()).toMatch(_id)
            expect(comment.commentedAt.toString()).toMatch(_toiletId)
        })

        it('should successfully untoggle the thumb down as well', async () => {
            await toggleThumbDown(_commentId)
            let user = await User.findById(_id).lean()
            let toilet = await Toilet.findById(_toiletId).populate('comments').lean()
            let comment = await Comment.findById(_commentId).lean()

            expect(user.comments).toBeInstanceOf(Array)
            expect(user.comments.length).toBe(1)
            expect(user.thumbsDown).toBeInstanceOf(Array)
            expect(user.thumbsDown.length).toBe(0)
            expect(user.thumbsDown[0]).toBeUndefined()

            expect(toilet.comments).toBeInstanceOf(Array)
            expect(toilet.comments.length).toBe(1)
            expect(toilet.comments[0].publisher.toString()).toMatch(_id)
            expect(toilet.comments[0].thumbsDown).toBeInstanceOf(Array)
            expect(toilet.comments[0].thumbsDown.length).toBe(0)
            expect(toilet.comments[0].thumbsDown[0]).toBeUndefined()

            expect(comment.thumbsDown).toBeInstanceOf(Array)
            expect(comment.thumbsDown.length).toBe(0)
            expect(comment.thumbsDown[0]).toBeUndefined()
            expect(comment.commentedAt.toString()).toMatch(_toiletId)
        })

        it('should fail to toggle/untoggle if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })

            let _error

            try {
                await toggleThumbDown(_commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to toggle thumb down if the user does not exist', async () => {
            await User.deleteMany()

            let _error
            try {
                await toggleThumbDown(_commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })

        it('should fail to toggle thumb down if the comment does not exist', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            await Comment.deleteMany()

            let _error
            try {
                await toggleThumbDown(_commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`comment with id ${_commentId} does not exist`)
        })

    })

    describe('unhappy paths', () => {
        it('should fail on a non-string toilet ID', () => {
            _commentId = 45438
            expect(() => toggleThumbDown(_commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = {}
            expect(() => toggleThumbDown(_commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = false
            expect(() => toggleThumbDown(_commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = [1, 2, 3]
            expect(() => toggleThumbDown(_commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => toggleThumbDown(_commentId)).toThrow(`commentId is empty`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
        await mongoose.disconnect()
    })
})