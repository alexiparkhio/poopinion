require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const publishToilet = require('./publish-toilet')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('publishToilet', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender, _id, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates, disabledToilet
    const GENDERS = ['male', 'female', 'non-binary']
    const BOOLEANS = [true, false]

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 120)
        gender = GENDERS[floor(random() * GENDERS.length)]
        place = `house of ${name}`
        latitude = random()
        latitudeDelta = random()
        longitude = random()
        longitudeDelta = random()
        coordinates = { latitude, longitude, latitudeDelta, longitudeDelta }
        disabledToilet = BOOLEANS[floor(random() * BOOLEANS.length)]
    })

    describe('when user already exists', () => {

        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender })
                .then(({ id }) => _id = id)
                .then(() => { })
        )

        it('should successfully publish a toilet post', () =>
            publishToilet(_id, place, disabledToilet, coordinates)
                .then(() => Toilet.findOne({ publisher: _id }))
                .then(toilet => {
                    expect(toilet.publisher.toString()).to.equal(_id)
                    expect(toilet.place).to.equal(place)
                    expect(toilet.disabledToilet).to.equal(disabledToilet)
                    expect(toilet.comments instanceof Array).to.equal(true)
                    expect(toilet.geolocation instanceof Object).to.equal(true)
                    expect(toilet.geolocation.latitude).to.equal(latitude)
                    expect(toilet.geolocation.longitude).to.equal(longitude)
                    expect(toilet.geolocation.latitudeDelta).to.equal(latitudeDelta)
                    expect(toilet.geolocation.longitudeDelta).to.equal(longitudeDelta)

                })
                .then(() => User.findById(_id).populate('publishedToilets'))
                .then(user => {
                    expect(user.publishedToilets instanceof Array).to.equal(true)
                    expect(user.publishedToilets[0]).not.to.be.undefined
                    expect(user.publishedToilets[0].publisher.toString()).to.equal(_id)
                    expect(user.publishedToilets[0].place).to.equal(place)
                    expect(user.publishedToilets[0].disabledToilet).to.equal(disabledToilet)
                    expect(user.publishedToilets[0].comments instanceof Array).to.equal(true)
                    expect(user.publishedToilets[0].geolocation instanceof Object).to.equal(true)
                    expect(user.publishedToilets[0].geolocation.latitude).to.equal(latitude)
                    expect(user.publishedToilets[0].geolocation.longitude).to.equal(longitude)
                    expect(user.publishedToilets[0].geolocation.latitudeDelta).to.equal(latitudeDelta)
                    expect(user.publishedToilets[0].geolocation.longitudeDelta).to.equal(longitudeDelta)
                })
                .then(() => { })
        )
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to post a toilet if the user does not exist', () =>
            publishToilet(_id, place, disabledToilet, coordinates)
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
        it('should fail to post a toilet if the user is deactivated', () =>
            publishToilet(_id, place, disabledToilet, coordinates)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`user with id ${_id} is deactivated`)
                })
        )
    })

    describe('unhappy paths', () => {
        beforeEach(() =>
            User.create({ name, surname, email, password, age, gender })
                .then(({ id }) => _id = id)
                .then(() => { })
        )

        it('should fail on a non-string place', () => {
            place = 9328743289
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `place ${place} is not a string`)

            place = false
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `place ${place} is not a string`)

            place = undefined
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `place ${place} is not a string`)

            place = []
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `place ${place} is not a string`)
        })

        it('should fail on a non-boolean disabledToilet', () => {
            place = 'some place'

            disabledToilet = 'sdhfbsdhfb'
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `disabledToilet ${disabledToilet} is not a boolean`)

            disabledToilet = 834758
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `disabledToilet ${disabledToilet} is not a boolean`)

            disabledToilet = undefined
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `disabledToilet ${disabledToilet} is not a boolean`)

            disabledToilet = []
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `disabledToilet ${disabledToilet} is not a boolean`)
        })

        it('should fail on a non-string id', () => {
            _id = 9328743289
            expect(() => publishToilet(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => publishToilet(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => publishToilet(_id)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => publishToilet(_id)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-object coordinates', () => {
            place = 'somewhere'
            disabledToilet = true

            coordinates = 9328743289
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `coordinates ${coordinates} is not a Object`)

            coordinates = false
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `coordinates ${coordinates} is not a Object`)

            coordinates = undefined
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `coordinates ${coordinates} is not a Object`)

            coordinates = 'asasa'
            expect(() => publishToilet(_id, place, disabledToilet, coordinates)).to.throw(TypeError, `coordinates ${coordinates} is not a Object`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})