require('dotenv').config()

const logic = require('.')
const { registerUser } = logic
const { mongoose, models: { User } } = require('poopinion-data')
const { random, floor } = Math
const bcrypt = require('bcryptjs')

const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL } = process.env
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('registerUser', () => {
    let name, surname, email, password, age, gender
    const GENDERS = ['male', 'female','non-binary']
    
    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`
        gender = GENDERS[floor(random() * GENDERS.length)]
    })

    it('should succeed on correct user data', async () => {
        const result = await registerUser(name, surname, email, password, age, gender)

        expect(result).toBeUndefined()

        const user = await User.findOne({ email })
        
        expect(user).toBeDefined()
        expect(typeof user.id).toBe('string')
        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.email).toBe(email)
        expect(user.created).toBeInstanceOf(Date)

        const validPassword = await bcrypt.compare(password, user.password)

        expect(validPassword).toBeTruthy()
    })

    it('should fail to register a user with an email that already exists', async () => {
        let _error
        await registerUser(name, surname, email, password, age, gender)
        
        try {
            await registerUser(name, surname, email, password, age, gender)
        } catch(error) {
            _error = error
        } expect(_error.message).toBe(`user with email ${email} already exists`)
    })

    describe('trying to register on invalid data', () => {
        it('should fail on a non string name', async () => {
            let _error
            name = 45438
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`name ${name} is not a string`)
            name = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`name ${name} is not a string`)
            name = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`name is empty`)
            name = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`name ${name} is not a string`)
        })

        it('should fail on a non string surname', async () => {
            let _error
            surname = 45438
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`surname ${surname} is not a string`)
            surname = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`surname ${surname} is not a string`)
            surname = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`surname is empty`)
            surname = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`surname ${surname} is not a string`)
        })

        it('should fail on a non string email', async () => {
            let _error
            email = 45438
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
            email = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
            email = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email is empty`)
            email = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`email ${email} is not a string`)
        })

        it('should fail on a non valid email address', async () => {
            let _error
            email = 'asjdvsdhjv'
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)
            email = '123@a'
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${email} is not an e-mail`)
        })

        it('should fail on a non string password', async () => {
            let _error
            password = 45438
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
            password = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password is empty`)
            password = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`password ${password} is not a string`)
        })

        it('should fail on a non-string age', async () => {
            age = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`age ${age} is not a string`)
            age = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`age ${age} is not a string`)
            age = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`age ${age} is not a string`)
        })

        it('should fail on a non-valid date of birth', async () => {
            age = '2020/99/00'
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${age} is not a valid date of birth`)
            age = '1992/03/35'
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${age} is not a valid date of birth`)
        })

        it('should fail on a non-valid gender type', async () => {
            let _error
            gender = 'asdasd'
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${gender} is not included on the gender list`)
            gender = false
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${gender} is not included on the gender list`)
            gender = undefined
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${gender} is not included on the gender list`)
            gender = []
            try {
                await registerUser(name, surname, email, password, age, gender)
            } catch (error) {
                _error = error
            } expect(_error.message).toBe(`${gender} is not included on the gender list`)
        })
    })

    afterAll(async () => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})