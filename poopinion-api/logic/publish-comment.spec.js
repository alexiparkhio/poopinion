require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const publishComment = require('./publish-comment')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('publishComment', () => {
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

    describe('when user and the toilet post exist', () => {

        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, password, age, gender }))
                .then(({ id }) => _id = id)
                .then(() => Promise.resolve(Toilet.create({ publisher: _id, place })))
                .then(({ id }) => _toiletId = id)
                .then(() => { })
        )

        it('should successfully publish a comment on the toilet post', () => {
            return publishComment(_id, _toiletId, rating)
                .then(() => Comment.findOne({ publisher: _id }))
                .then(comment => {
                    expect(comment.publisher.toString()).to.equal(_id)
                    expect(comment.commentedAt.toString()).to.equal(_toiletId)

                    const { rating: { cleanness, looks, multipleToilets, paymentRequired, paperDeployment, overallRating, textArea } } = comment
                    expect(cleanness).to.equal(rating.cleanness)
                    expect(looks).to.equal(rating.looks)
                    expect(multipleToilets).to.equal(rating.multipleToilets)
                    expect(paymentRequired).to.equal(rating.paymentRequired)
                    expect(paperDeployment).to.equal(rating.paperDeployment)
                    expect(overallRating).to.equal(rating.overallRating)
                    expect(textArea).to.equal(rating.textArea)
                })
                .then(() => User.findById(_id).populate('comments').lean())
                .then(user => {

                    expect(user.comments instanceof Array).to.equal(true)
                    expect(user.comments[0].publisher.toString()).to.equal(_id)
                    expect(user.comments[0].rating).not.to.be.undefined
                    expect(user.comments[0].rating.cleanness).to.equal(rating.cleanness)
                    expect(user.comments[0].rating.looks).to.equal(rating.looks)
                    expect(user.comments[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                    expect(user.comments[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                    expect(user.comments[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                    expect(user.comments[0].rating.overallRating).to.equal(rating.overallRating)
                    expect(user.comments[0].rating.textArea).to.equal(rating.textArea)
                })
                .then(() => { })
        })

    })

    describe('when the comment already exists', () => {
        it('should fail to add the comment if it the toilet was already commented by that user', () => {
            return publishComment(_id, _toiletId, rating)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} already commented on toilet with id ${_toiletId}`)
                })
                .then(() => { })
        })
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a comment if the user does not exist', () =>
            publishComment(_id, _toiletId, rating)
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
            publishComment(_id, _toiletId, rating)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
        )
    })

    describe('when the toilet does not exist', () => {
        beforeEach(() =>
            Toilet.deleteMany()
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: false } }))
                .then(() => { })
        )

        it('should fail to post a comment if the toilet post does not exist', () =>
            publishComment(_id, _toiletId, rating)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`toilet with id ${_toiletId} does not exist`)
                })
                .then(() => { })
        )

        afterEach(() => Promise.resolve(User.deleteMany()).then(() => { }))
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
                .then(() => { })
        )

        it('should fail on a non-string user id', () => {
            _id = 9328743289
            expect(() => publishComment(_id, _toiletId, rating)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => publishComment(_id, _toiletId, rating)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => publishComment(_id, _toiletId, rating)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => publishComment(_id, _toiletId, rating)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string id', () => {
            _toiletId = 9328743289
            expect(() => publishComment(__id, _toiletId, rating)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => publishComment(__id, _toiletId, rating)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => publishComment(__id, _toiletId, rating)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = []
            expect(() => publishComment(__id, _toiletId, rating)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})