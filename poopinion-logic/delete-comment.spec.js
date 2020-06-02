require('dotenv').config()

const logic = require('.')
const { deleteComment } = logic
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const { NotFoundError } = require('poopinion-errors')
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('deleteComment', () => {
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
            cleanness: random() * 5,
            looks: random() * 5,
            multipleToilets: random() * 2,
            paperDeployment: random() * 2,
            paymentRequired: random() * 2,
            overallRating: random() * 5,
            textArea: `opinion-${random()}`
        }
    })

    describe('happy paths', () => {

        it('should successfully delete a comment that has already been posted', async () => {
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

            toilet = await Toilet.findById(_toiletId).populate('comments')
            user = await User.findById(_id).lean()

            expect(toilet.comments).toBeInstanceOf(Array)
            expect(toilet.comments.length).toBe(1)
            expect(toilet.comments[0].publisher.toString()).toMatch(_id)
            expect(toilet.comments[0].rating).toBeInstanceOf(Object)

            expect(toilet.comments[0].rating.cleanness).toBe(rating.cleanness)
            expect(toilet.comments[0].rating.multipleToilets).toBe(rating.multipleToilets)
            expect(toilet.comments[0].rating.looks).toBe(rating.looks)
            expect(toilet.comments[0].rating.paperDeployment).toBe(rating.paperDeployment)
            expect(toilet.comments[0].rating.paymentRequired).toBe(rating.paymentRequired)
            expect(toilet.comments[0].rating.overallRating).toBe(rating.overallRating)
            expect(toilet.comments[0].rating.textArea).toBe(rating.textArea)

            expect(user.comments).toBeInstanceOf(Array)
            expect(user.comments.length).toBe(1)
            expect(user.comments[0].toString()).toMatch(_commentId.toString())

            let deleted = await deleteComment(_toiletId, _commentId)

            expect(deleted).toBeUndefined()

            toilet = await Toilet.findById(_toiletId).populate('comments')
            user = await User.findById(_id).lean()

            expect(toilet.comments.length).toBe(0)
            expect(user.comments.length).toBe(0)

            const findComment = await Comment.findById(_commentId)
            expect(findComment).toBe(null)
        })

        it('should fail to delete the comment if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })

            let _error

            try {
                await deleteComment(_toiletId, _commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to delete the comment if the user does not exist', async () => {
            await User.deleteMany()

            let _error
            try {
                await deleteComment(_toiletId, _commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })

        it('should fail to delete the comment if the toilet does not exist', async () => {
            let user = await User.create({ name, surname, email, password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)
            await Toilet.deleteMany()

            let _error
            try {
                await deleteComment(_toiletId, _commentId)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`toilet with id ${_toiletId} does not exist`)
        })

        it('should fail to delete the comment if the comment does not exist', async () => {
            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            let comment = await Comment.create({ place, publisher: _id, commentedAt: _toiletId, rating })
            let _commentId = comment._id.toString()

            await Comment.deleteMany()

            let _error
            try {
                await deleteComment(_toiletId, _commentId)
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
            _toiletId = 45438
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = {}
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = [1, 2, 3]
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`toiletId ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`toiletId is empty`)
        })

        it('should fail on a non-string comment ID', () => {
            _toiletId = 'some toiletId'
            _commentId = 45438
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = {}
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = false
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = [1, 2, 3]
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`commentId ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => deleteComment(_toiletId, _commentId)).toThrow(`commentId is empty`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
        await mongoose.disconnect()
    })
})