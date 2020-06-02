require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const searchToilets = require('./search-toilets')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('searchToilets', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, surname, email, password, age, gender, query
    const GENDERS = ['male', 'female', 'non-binary']

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 120)
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    describe('when toilets can be retrieved', () => {

        beforeEach(() =>
            Promise.resolve(User.create({ name, surname, email, password, age, gender }))
                .then(({ id }) => _id = id)
                .then(() => {
                    const toilets = []
                    for (let i = 0; i < 10; i++) {
                        const publisher = _id, place = `${i >= 5 ? 'house of ' : 'home of '}-${i}`
                        toilets.push({ publisher, place })
                    }

                    return Toilet.create(toilets)
                })
                .then(() => { })
        )

        it('should successfully retrieve all toilets that match the query "home"', () => {
            query = 'home'
            searchToilets(query)
                .then(results => {
                    expect(results.length).to.equal(5)

                    results.forEach((toilet, index) => {
                        expect(toilet).to.be.instanceOf(Object)
                        const { place } = toilet
                        expect(place).to.equal(`home of -${index}`)
                    })
                })
                .then(() => { })
        })

        it('should successfully retrieve all toilets that match the query "house"', () => {
            query = 'house'
            searchToilets(query)
                .then(results => {
                    expect(results.length).to.equal(5)

                    results.forEach((toilet, index) => {
                        expect(toilet).to.be.instanceOf(Object)
                        const { place } = toilet
                        expect(place).to.equal(`house of -${index + 5}`)
                    })
                })
                .then(() => { })
        })

        it('should successfully retrieve all toilets that match the query "ho"', () => {
            query = 'ho'
            searchToilets(query)
                .then(results => {
                    expect(results.length).to.equal(10)

                    results.forEach((toilet, index) => {
                        expect(toilet).to.be.instanceOf(Object)
                        const { place } = toilet
                        expect(place).to.equal(`${index >= 5 ? `house of -${index}` : `home of -${index}`}`)
                    })
                })
                .then(() => { })
        })

        it('should successfully retrieve an empty if the query find no matches', () => {
            query = 'something-really WronG that should n0t be f@und'
            searchToilets(query)
                .then(results => {
                    expect(results.length).to.equal(0)
                    expect(results).to.be.instanceOf(Array)
                })
                .then(() => { })
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non-string query', () => {
            query = 9328743289
            expect(() => searchToilets(query)).to.throw(TypeError, `query ${query} is not a string`)

            query = false
            expect(() => searchToilets(query)).to.throw(TypeError, `query ${query} is not a string`)

            query = undefined
            expect(() => searchToilets(query)).to.throw(TypeError, `query ${query} is not a string`)

            query = []
            expect(() => searchToilets(query)).to.throw(TypeError, `query ${query} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})