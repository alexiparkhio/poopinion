require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const toggleThumbUp = require('./toggle-thumb-up')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('toggleThumbUp', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender, _id, _toiletId, place, rating = {}
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

    describe('when user, comment and the toilet post exist', () => {
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

        it('should successfully add or remove the thumb-up feature to the target comment', () => {
            return toggleThumbUp(_id, _commentId)
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsUp.length).to.equal(1)
                    expect(comment.thumbsUp.length).to.equal(1)
                    expect(comment.thumbsUp[0].toString()).to.equal(_id)
                    return expect(user.thumbsUp[0].toString()).to.equal(_commentId)
                })
                .then(() => User.findById(_id).populate('thumbsUp').lean())
                .then(user => {
                    const { thumbsUp } = user
                    expect(thumbsUp).to.be.instanceOf(Array)
                    expect(thumbsUp[0].publisher.toString()).to.equal(_id)
                    expect(thumbsUp[0].commentedAt.toString()).to.equal(_toiletId)
                    expect(thumbsUp[0].thumbsUp[0].toString()).to.equal(_id)

                    expect(thumbsUp[0].rating.cleanness).to.equal(rating.cleanness)
                    expect(thumbsUp[0].rating.looks).to.equal(rating.looks)
                    expect(thumbsUp[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(thumbsUp[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(thumbsUp[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(thumbsUp[0].rating.overallRating).to.equal(rating.overallRating)
                    expect(thumbsUp[0].rating.textArea).to.equal(rating.textArea)
                })
                .then(() => toggleThumbUp(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsUp.length).to.equal(0)
                    expect(user.thumbsUp).to.be.instanceOf(Array)
                    expect(comment.thumbsUp.length).to.equal(0)
                    return expect(comment.thumbsUp).to.be.instanceOf(Array)
                })
                .then(() => toggleThumbUp(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsUp.length).to.equal(1)
                    expect(comment.thumbsUp.length).to.equal(1)
                    expect(comment.thumbsUp[0].toString()).to.equal(_id)
                    return expect(user.thumbsUp[0].toString()).to.equal(_commentId)
                })
                .then(() => User.findById(_id).populate('thumbsUp').lean())
                .then(user => {
                    const { thumbsUp } = user
                    expect(thumbsUp).to.be.instanceOf(Array)
                    expect(thumbsUp[0].publisher.toString()).to.equal(_id)
                    expect(thumbsUp[0].commentedAt.toString()).to.equal(_toiletId)
                    expect(thumbsUp[0].thumbsUp[0].toString()).to.equal(_id)

                    expect(thumbsUp[0].rating.cleanness).to.equal(rating.cleanness)
                    expect(thumbsUp[0].rating.looks).to.equal(rating.looks)
                    expect(thumbsUp[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(thumbsUp[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(thumbsUp[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(thumbsUp[0].rating.overallRating).to.equal(rating.overallRating)
                    expect(thumbsUp[0].rating.textArea).to.equal(rating.textArea)
                })
                .then(() => toggleThumbUp(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsUp.length).to.equal(0)
                    expect(user.thumbsUp).to.be.instanceOf(Array)
                    expect(comment.thumbsUp.length).to.equal(0)
                    return expect(comment.thumbsUp).to.be.instanceOf(Array)
                })
                .then(() => { })
        })

    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a comment if the user does not exist', () =>
            toggleThumbUp(_id, _commentId)
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
        it('should fail to post a comment if the user is deactivated', () =>
            toggleThumbUp(_id, _commentId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
        )
    })

    describe('when the comment does not exist', () => {
        beforeEach(() =>
            Comment.deleteMany()
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: false } }))
                .then(() => { })
        )

        it('should fail to post a comment if the toilet post does not exist', () =>
            toggleThumbUp(_id, _commentId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`comment with id ${_commentId} does not exist`)
                })
                .then(() => { })
        )
    })

    describe('unhappy paths', () => {
        let __id
        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, password, age, gender }))
                .then(({ id }) => {
                    _id = id
                    __id = id
                })
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

        it('should fail on a non-string user id', () => {
            _id = 9328743289
            expect(() => toggleThumbUp(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => toggleThumbUp(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => toggleThumbUp(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => toggleThumbUp(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string id', () => {
            
            _commentId = 9328743289
            expect(() => toggleThumbUp(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = false
            expect(() => toggleThumbUp(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => toggleThumbUp(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = []
            expect(() => toggleThumbUp(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})