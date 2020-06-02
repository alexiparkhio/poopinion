require('dotenv').config()

const { expect } = require('chai')
const { random, floor } = Math
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const updateComment = require('./update-comment')
const { env: { TEST_MONGODB_URL } } = process

describe('updateComment', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender, _id, _toiletId, _commentId, place, rating = {}
    const GENDERS = ['male', 'female', 'non-binary']
    const YESORNO = [true, false]

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 120)
        gender = GENDERS[floor(random() * GENDERS.length)]
        place = `house of ${name}`
        rating.cleanness = floor(random() * 5)
        rating.looks = floor(random() * 5)
        rating.multipleToilets = YESORNO[floor(random() * YESORNO.length)]
        rating.paymentRequired = YESORNO[floor(random() * YESORNO.length)]
        rating.paperDeployment = YESORNO[floor(random() * YESORNO.length)]
        rating.overallRating = floor(random() * 5)
        rating.textArea = `opinion-${random()}`
    })

    describe('when the user exists', () => {
        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, password, age, gender }))
                .then(({ id }) => _id = id)
                .then(() => Promise.resolve(Toilet.create({ publisher: _id, place })))
                .then(({ id }) => _toiletId = id)
                .then(() => Promise.all([User.findById(_id), Toilet.findById(_toiletId)]))
                .then(([user, toilet]) => {
                    const comment = new Comment({ place, publisher: _id, commentedAt: _toiletId, rating })
                    user.comments.push(comment)
                    toilet.comments.push(comment)
                    return Promise.all([user.save(), toilet.save(), comment.save()])
                })
                .then(() => Comment.findOne({ publisher: _id }))
                .then(({ id }) => _commentId = id)
                .then(() => { })
        )

        it('should succeed on correct user data', () =>
            Comment.findById(_commentId).lean()
                .then(comment => {
                    expect(comment).to.exist
                    expect(comment.publisher.toString()).to.equal(_id)
                    expect(comment.commentedAt.toString()).to.equal(_toiletId)
                    expect(comment.rating).to.be.instanceOf(Object)
                    expect(comment.rating.cleanness).to.equal(rating.cleanness)
                    expect(comment.rating.looks).to.equal(rating.looks)
                    expect(comment.rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(comment.rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(comment.rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(comment.rating.overallRating).to.equal(rating.overallRating)
                    expect(comment.rating.textArea).to.equal(rating.textArea)
                })
                .then(() =>
                    updateComment(_id, _commentId, { pendejada: 'maxima', rating: { cleanness: rating.cleanness + 1, looks: rating.looks + 1, overallRating: rating.overallRating - 1, textArea: `${rating.textArea}-updated` } })
                )
                .then(() => Comment.findById(_commentId).lean())
                .then(comment => {
                    expect(comment).to.exist
                    expect(comment.publisher.toString()).to.equal(_id)
                    expect(comment.commentedAt.toString()).to.equal(_toiletId)
                    expect(comment.rating).to.be.instanceOf(Object)
                    expect(comment.rating.cleanness).to.equal(rating.cleanness + 1)
                    expect(comment.rating.looks).to.equal(rating.looks + 1)
                    expect(comment.rating.overallRating).to.equal(rating.overallRating - 1)
                    expect(comment.rating.textArea).to.equal(`${rating.textArea}-updated`)
                    expect(comment.pendejada).to.be.undefined
                })
                .then(() => { })
        )
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to update if the user does not exist', () =>
            updateComment(_id, _commentId, { rating: { pendejada: 'maxima', textArea: `${rating.textArea}-updated` } })
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {

                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} does not exist`)
                })
                .then(() => { })
        )
    })

    describe('when the user is deactivated', () => {
        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender })
                .then(({ id }) => _id = id)
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: true } }))
                .then(() => { })
        )

        it('should fail to remove a comment if the user is deactivated', () =>
            updateComment(_id, _commentId, { rating: { pendejada: 'maxima', textArea: `${rating.textArea}-updated` } })
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
                .then(() => { })
        )
    })

    describe('when the comment does not exist', () => {
        beforeEach(() => Toilet.deleteMany()
            .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: false } }))
            .then(() => Promise.resolve(Toilet.create({ place, publisher: _id })))
            .then(({ id }) => _toiletId = id)
            .then(() => {
                return Comment.deleteMany()
            })
            .then(() => { })

        )


        it('should fail to attempt a comment update on a non-existing comment', () =>
            updateComment(_id, _commentId, { rating: { pendejada: 'maxima', textArea: `${rating.textArea}-updated` } })
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`comment with id ${_commentId} does not exist`)
                })
                .then(() => { })
        )
        afterEach(() => Promise.resolve(User.deleteMany()).then(() => { }))
    })

    describe('unhappy paths', () => {
        let __id, __toiletId, __commentId
        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, password, age, gender }))
                .then(({ id }) => {
                    _id = id
                    __id = id
                })
                .then(() => Promise.resolve(Toilet.create({ publisher: _id, place })))
                .then(({ id }) => {
                    _toiletId = id
                    __toiletId = id
                })
                .then(() => Promise.resolve(Comment.create({ publisher: _id, commentedAt: _toiletId, rating })))
                .then(({ id }) => {
                    __commentId = id
                    _commentId = id
                })
                .then(() => { })
        )

        it('should fail on a non-string user id', () => {
            _id = 9328743289
            expect(() => updateComment(_id, _commentId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => updateComment(_id, _commentId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => updateComment(_id, _commentId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => updateComment(_id, _commentId, { place })).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string comment id', () => {
            _commentId = 9328743289
            expect(() => updateComment(__id, _commentId, { place })).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = false
            expect(() => updateComment(__id, _commentId, { place })).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => updateComment(__id, _commentId, { place })).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = []
            expect(() => updateComment(__id, _commentId, { place })).to.throw(TypeError, `comment ID ${_commentId} is not a string`)
        })

        it('should fail on a non-object data', () => {
            data = 9328743289
            expect(() => updateComment(__id, __commentId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = false
            expect(() => updateComment(__id, __commentId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = undefined
            expect(() => updateComment(__id, __commentId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = 'function () { }'
            expect(() => updateComment(__id, __commentId, data)).to.throw(TypeError, `data ${data} is not a Object`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})