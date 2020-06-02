require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveFavToilets = require('./retrieve-fav-toilets')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('retrieveFavToilets', () => {
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
                .then(() => Promise.all([User.findByIdAndUpdate(_id, { $push: { favToilets: _toiletId } }), Toilet.findByIdAndUpdate(_toiletId, { $push: { isFavedBy: _id } })]))
                .then(() => { })
        )

        it('should successfully retrieve all fav toilets from the favToilets array', () => {
            return retrieveFavToilets(_id)
                .then(toilets => {
                    expect(toilets.length).to.equal(1)
                    expect(toilets).to.be.instanceOf(Array)
                    expect(toilets[0].id.toString()).to.equal(_toiletId)
                    expect(toilets[0].publisher.id.toString()).to.equal(_id)
                    expect(toilets[0].place).to.equal(place)
                    return expect(toilets[0].isFavedBy[0].toString()).to.equal(_id)
                })
                .then(() => { })
        })
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a comment if the user does not exist', () =>
            retrieveFavToilets(_id)
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
            retrieveFavToilets(_id)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
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
            expect(() => retrieveFavToilets(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => retrieveFavToilets(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => retrieveFavToilets(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => retrieveFavToilets(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})