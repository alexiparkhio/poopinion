require('dotenv').config()

const { expect } = require('chai')
const { random, floor } = Math
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const updateToilet = require('./update-toilet')
const { env: { TEST_MONGODB_URL } } = process

describe('updateToilet', () => {
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
            Toilet.findById(_toiletId).lean()
                .then(toilet => {
                    expect(toilet).to.exist
                    expect(toilet.place).to.equal(place)
                    expect(toilet.publisher.toString()).to.equal(_id)
                    expect(toilet.comments[0]._id.toString()).to.equal(_commentId)
                })
                .then(() =>
                    updateToilet(_id, _toiletId, { pendejada: 'maxima', place: `${place}-updated` })
                )
                .then(() => Toilet.findById(_toiletId).lean())
                .then(toilet => {
                    expect(toilet).to.exist
                    expect(toilet._id.toString()).to.equal(_toiletId)
                    expect(toilet.place).to.equal(`${place}-updated`)
                    expect(toilet.pendejada).to.be.undefined
                })
                .then(() => { })
        )
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to update if the user does not exist', () =>
            updateToilet(_id, _toiletId, { pendejada: 'maxima', place: `${place}-updated` })
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
            updateToilet(_id, _toiletId, { pendejada: 'maxima', place: `${place}-updated` })
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
                .then(() => { })
        )
    })

    describe('when the toilet does not exist', () => {
        beforeEach(() =>
            Toilet.deleteMany()
                .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: false } }))
                .then(() => { })
        )

        it('should fail to remove a comment on a non-existing toilet', () =>
            updateToilet(_id, _toiletId, { pendejada: 'maxima', place: `${place}-updated` })
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`toilet with id ${_toiletId} does not exist`)
                })
                .then(() => { })
        )
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
            expect(() => updateToilet(_id, _toiletId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => updateToilet(_id, _toiletId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => updateToilet(_id, _toiletId, { place })).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => updateToilet(_id, _toiletId, { place })).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string toilet id', () => {
            _toiletId = 9328743289
            expect(() => updateToilet(__id, _toiletId, { place })).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => updateToilet(__id, _toiletId, { place })).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => updateToilet(__id, _toiletId, { place })).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = []
            expect(() => updateToilet(__id, _toiletId, { place })).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)
        })

        it('should fail on a non-object data', () => {
            data = 9328743289
            expect(() => updateToilet(__id, __toiletId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = false
            expect(() => updateToilet(__id, __toiletId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = undefined
            expect(() => updateToilet(__id, __toiletId, data)).to.throw(TypeError, `data ${data} is not a Object`)

            data = 'function () { }'
            expect(() => updateToilet(__id, __toiletId, data)).to.throw(TypeError, `data ${data} is not a Object`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})