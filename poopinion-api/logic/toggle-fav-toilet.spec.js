require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const toggleFavToilet = require('./toggle-fav-toilet')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('toggleFavToilet', () => {
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
                .then(({ id }) => {
                    _toiletId = id
                    User.findByIdAndUpdate(_id, { $push: { publishedToilets: id } })
                })
                .then(() => { })
        )

        it('should successfully add/remove the toilet post on favorites array (depending if its on it already or not) for the user', () => {
            return toggleFavToilet(_id, _toiletId)
                .then(() => Promise.all([User.findById(_id).lean(), Toilet.findById(_toiletId).lean()]))
                .then(([user, toilet]) => {
                    expect(user.favToilets.length).to.equal(1)
                    expect(toilet.isFavedBy.length).to.equal(1)
                    expect(toilet.isFavedBy[0].toString()).to.equal(_id)
                    return expect(user.favToilets[0].toString()).to.equal(_toiletId)
                })
                .then(() => User.findById(_id).populate('favToilets').lean())
                .then(user => {
                    const { favToilets } = user
                    expect(favToilets[0].place).to.equal(place)
                    expect(favToilets[0].publisher.toString()).to.equal(_id)
                })
                .then(() => toggleFavToilet(_id, _toiletId))
                .then(() => Promise.all([User.findById(_id).lean(), Toilet.findById(_toiletId).lean()]))
                .then(([user, toilet]) => {
                    expect(user.favToilets.length).to.equal(0)
                    expect(user.favToilets).to.be.instanceOf(Array)
                    expect(toilet.isFavedBy.length).to.equal(0)
                    return expect(toilet.isFavedBy).to.be.instanceOf(Array)
                })
                .then(() => toggleFavToilet(_id, _toiletId))
                .then(() => Promise.all([User.findById(_id).lean(), Toilet.findById(_toiletId).lean()]))
                .then(([user, toilet]) => {
                    expect(user.favToilets.length).to.equal(1)
                    expect(toilet.isFavedBy.length).to.equal(1)
                    expect(toilet.isFavedBy[0].toString()).to.equal(_id)
                    return expect(user.favToilets[0].toString()).to.equal(_toiletId)
                })
                .then(() => User.findById(_id).populate('favToilets').lean())
                .then(user => {
                    const { favToilets } = user
                    expect(favToilets[0].place).to.equal(place)
                    expect(favToilets[0].publisher.toString()).to.equal(_id)
                })
                .then(() => toggleFavToilet(_id, _toiletId))
                .then(() => Promise.all([User.findById(_id).lean(), Toilet.findById(_toiletId).lean()]))
                .then(([user, toilet]) => {
                    expect(user.favToilets.length).to.equal(0)
                    expect(user.favToilets).to.be.instanceOf(Array)
                    expect(toilet.isFavedBy.length).to.equal(0)
                    return expect(toilet.isFavedBy).to.be.instanceOf(Array)
                })
                .then(() => { })
        })

    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a comment if the user does not exist', () =>
            toggleFavToilet(_id, _toiletId)
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
            toggleFavToilet(_id, _toiletId)
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
            toggleFavToilet(_id, _toiletId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`toilet with id ${_toiletId} does not exist`)
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
                .then(() => { })
        )

        it('should fail on a non-string user id', () => {
            _id = 9328743289
            expect(() => toggleFavToilet(_id, _toiletId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => toggleFavToilet(_id, _toiletId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => toggleFavToilet(_id, _toiletId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => toggleFavToilet(_id, _toiletId)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string id', () => {
            _toiletId = 9328743289
            expect(() => toggleFavToilet(__id, _toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => toggleFavToilet(__id, _toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => toggleFavToilet(__id, _toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = []
            expect(() => toggleFavToilet(__id, _toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})