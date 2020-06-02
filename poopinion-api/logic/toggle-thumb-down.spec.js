require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const toggleThumbDown = require('./toggle-thumb-down')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('toggleThumbDown', () => {
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
            return toggleThumbDown(_id, _commentId)
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsDown.length).to.equal(1)
                    expect(comment.thumbsDown.length).to.equal(1)
                    expect(comment.thumbsDown[0].toString()).to.equal(_id)
                    return expect(user.thumbsDown[0].toString()).to.equal(_commentId)
                })
                .then(() => User.findById(_id).populate('thumbsDown').lean())
                .then(user => {
                    const { thumbsDown } = user
                    expect(thumbsDown).to.be.instanceOf(Array)
                    expect(thumbsDown[0].publisher.toString()).to.equal(_id)
                    expect(thumbsDown[0].commentedAt.toString()).to.equal(_toiletId)
                    expect(thumbsDown[0].thumbsDown[0].toString()).to.equal(_id)

                    expect(thumbsDown[0].rating.cleanness).to.equal(rating.cleanness)
                    expect(thumbsDown[0].rating.looks).to.equal(rating.looks)
                    expect(thumbsDown[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(thumbsDown[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(thumbsDown[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(thumbsDown[0].rating.overallRating).to.equal(rating.overallRating)
                    expect(thumbsDown[0].rating.textArea).to.equal(rating.textArea)
                })
                .then(() => toggleThumbDown(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsDown.length).to.equal(0)
                    expect(user.thumbsDown).to.be.instanceOf(Array)
                    expect(comment.thumbsDown.length).to.equal(0)
                    return expect(comment.thumbsDown).to.be.instanceOf(Array)
                })
                .then(() => toggleThumbDown(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsDown.length).to.equal(1)
                    expect(comment.thumbsDown.length).to.equal(1)
                    expect(comment.thumbsDown[0].toString()).to.equal(_id)
                    return expect(user.thumbsDown[0].toString()).to.equal(_commentId)
                })
                .then(() => User.findById(_id).populate('thumbsDown').lean())
                .then(user => {
                    const { thumbsDown } = user
                    expect(thumbsDown).to.be.instanceOf(Array)
                    expect(thumbsDown[0].publisher.toString()).to.equal(_id)
                    expect(thumbsDown[0].commentedAt.toString()).to.equal(_toiletId)
                    expect(thumbsDown[0].thumbsDown[0].toString()).to.equal(_id)

                    expect(thumbsDown[0].rating.cleanness).to.equal(rating.cleanness)
                    expect(thumbsDown[0].rating.looks).to.equal(rating.looks)
                    expect(thumbsDown[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(thumbsDown[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(thumbsDown[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(thumbsDown[0].rating.overallRating).to.equal(rating.overallRating)
                    expect(thumbsDown[0].rating.textArea).to.equal(rating.textArea)
                })
                .then(() => toggleThumbDown(_id, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Comment.findById(_commentId).lean()]))
                .then(([user, comment]) => {
                    expect(user.thumbsDown.length).to.equal(0)
                    expect(user.thumbsDown).to.be.instanceOf(Array)
                    expect(comment.thumbsDown.length).to.equal(0)
                    return expect(comment.thumbsDown).to.be.instanceOf(Array)
                })
                .then(() => { })
        })

    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a comment if the user does not exist', () =>
            toggleThumbDown(_id, _commentId)
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
            toggleThumbDown(_id, _commentId)
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
            toggleThumbDown(_id, _commentId)
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
            expect(() => toggleThumbDown(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => toggleThumbDown(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => toggleThumbDown(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => toggleThumbDown(_id, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string id', () => {
            
            _commentId = 9328743289
            expect(() => toggleThumbDown(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = false
            expect(() => toggleThumbDown(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => toggleThumbDown(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = []
            expect(() => toggleThumbDown(__id, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})