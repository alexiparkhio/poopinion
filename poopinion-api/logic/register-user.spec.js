require('dotenv').config()

const { expect } = require('chai')
const { random, floor } = Math
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const registerUser = require('./register-user')
const bcrypt = require('bcryptjs')
const { ContentError } = require('poopinion-errors')

const { env: { TEST_MONGODB_URL } } = process

describe('registerUser', () => {
    let name, surname, email, password, age, gender
    const GENDERS = ['male', 'female', 'non-binary']

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    it('should succeed on correct user data', () =>
        registerUser(name, surname, email, password, age, gender)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return User.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.gender).to.equal(gender)
                expect(user.age).to.equal(age)
                expect(user.created).to.be.instanceOf(Date)
                expect(user.favToilets).to.be.instanceOf(Array)
                expect(user.thumbsUp).to.be.instanceOf(Array)
                expect(user.thumbsDown).to.be.instanceOf(Array)
                expect(user.publishedToilets).to.be.instanceOf(Array)
                expect(user.comments).to.be.instanceOf(Array)

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    )

    it('should fail to register if the user email already exists', () =>
        registerUser(name, surname, email, password, age, gender)
            .catch(({ message }) => {
                expect(message).not.to.be.undefined
                expect(message).to.equal(`user with email ${email} already exists`)
            })
    )

    it('should fail on a non-string name', () => {
        name = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `name ${name} is not a string`)

        name = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `name ${name} is not a string`)

        name = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `name ${name} is not a string`)

        name = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `name ${name} is not a string`)
    })

    it('should fail on a non-string surname', () => {
        surname = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `surname ${surname} is not a string`)

        surname = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on a non-string and non-valid email', () => {
        email = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `email ${email} is not a string`)

        email = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `email ${email} is not a string`)

        email = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `email ${email} is not a string`)

        email = 'kfjsnfksdn'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${email} is not an e-mail`)

        email = 'kfjsnfksdn@123'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${email} is not an e-mail`)
    })

    it('should fail on a non-string password', () => {
        password = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `password ${password} is not a string`)

        password = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `password ${password} is not a string`)

        password = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `password ${password} is not a string`)
    })

    it('should fail on a non-string age', () => {
        age = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `age ${age} is not a string`)

        age = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `age ${age} is not a string`)

        age = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `age ${age} is not a string`)

        age = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `age ${age} is not a string`)
    })

    it('should fail on a non-valid date of birth', () => {
        age = '2020-99-00'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${age} is not a valid date of birth`)

        age = '2020-12-40'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${age} is not a valid date of birth`)
    })

    it('should fail on a non-string gender', () => {
        gender = 9328743289
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `gender ${gender} is not a string`)

        gender = false
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `gender ${gender} is not a string`)

        gender = undefined
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `gender ${gender} is not a string`)

        gender = []
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(TypeError, `gender ${gender} is not a string`)

        gender = 'mal'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${gender} is not included on the gender list`)

        gender = 'fem'
        expect(() => registerUser(name, surname, email, password, age, gender)).to.throw(ContentError, `${gender} is not included on the gender list`)
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})