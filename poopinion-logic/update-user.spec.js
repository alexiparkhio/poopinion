require('dotenv').config()

const logic = require('.')
const { updateUser } = logic
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')
const { random, floor } = Math
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { NotFoundError } = require('poopinion-errors')
const { TEST_API_URL: API_URL, TEST_MONGODB_URL: MONGODB_URL, TEST_JWT_SECRET: JWT_SECRET } = process.env
const AsyncStorage = require('not-async-storage')

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = API_URL

describe('updateUser', () => {
    let name, surname, email, password, age, gender, dataUpdated, place, latitude, longitude, latitudeDelta, longitudeDelta, coordinates, _id, _toiletId, _commentId
    const GENDERS = ['male', 'female', 'non-binary']

    beforeAll(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`
        gender = GENDERS[floor(random() * GENDERS.length)]
        dataUpdated = {
            name: `newName-${random()}`,
            surname: `newSurame-${random()}`,
            age: `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`,
            password: password
        }
        place = `place-${random()}`
        latitudeDelta = random()
        longitudeDelta = random()
        latitude = random()
        longitude = random()
        coordinates = { latitude, longitude, latitudeDelta, longitudeDelta }
    })

    describe('happy paths', () => {
        it('should successfully update a user info on correct credentials', async () => {
            let _password = await bcrypt.hash(password, 10)
            let user = await User.create({ name, surname, email, password: _password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, '👌', { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            user = await User.findById(_id)
            toilet = await Toilet.findById(_toiletId).populate('publisher', 'name surname age')

            expect(user).toBeDefined()
            expect(user.name).toMatch(name)
            expect(user.surname).toMatch(surname)
            expect(user.email).toMatch(email)
            expect(user.gender).toMatch(gender)
            expect(user.age).toBe(age)

            expect(toilet).toBeDefined()
            expect(toilet.publisher.name).toMatch(name)
            expect(toilet.publisher.surname).toMatch(surname)
            expect(toilet.publisher.age).toBe(age)

            let update = await updateUser(dataUpdated)
            expect(update).toBeUndefined()

            toilet = await Toilet.findById(_toiletId).populate('publisher', 'name surname age')
            user = await User.findById(_id)

            expect(user).toBeDefined()
            expect(user.name).toMatch(dataUpdated.name)
            expect(user.surname).toMatch(dataUpdated.surname)
            expect(user.age).toBe(dataUpdated.age)

            expect(toilet).toBeDefined()
            expect(toilet.publisher.name).toMatch(dataUpdated.name)
            expect(toilet.publisher.surname).toMatch(dataUpdated.surname)
            expect(toilet.publisher.age).toBe(dataUpdated.age)
        })

        it('should successfully allow to change password on a new value', async () => {
            let _password = await bcrypt.hash(password, 10)
            let user = await User.create({ name, surname, email, password: _password, age, gender });
            _id = user.id
            token = jwt.sign({ sub: _id }, JWT_SECRET, { expiresIn: '1d' })
            await logic.__context__.storage.setItem('token', token)

            let toilet = await Toilet.create({ publisher: _id, place, coordinates })
            _toiletId = toilet.id

            dataUpdated = {
                name: `newName-${random()}`,
                surname: `newSurame-${random()}`,
                age: `2000-0${floor(random() * 8) + 1}` + "-" + `0${floor(random() * 8) + 1}`,
                password: password,
                newPassword: `newPassword-${random()}`
            }

            user = await User.findById(_id)
            toilet = await Toilet.findById(_toiletId).populate('publisher', 'name surname age')

            expect(user).toBeDefined()
            expect(user.name).toMatch(name)
            expect(user.surname).toMatch(surname)
            expect(user.email).toMatch(email)
            expect(user.gender).toMatch(gender)
            expect(user.age).toBe(age)
            const valid = await bcrypt.compare(password, user.password)
            expect(valid).toBe(true)

            expect(toilet).toBeDefined()
            expect(toilet.publisher.name).toMatch(name)
            expect(toilet.publisher.surname).toMatch(surname)
            expect(toilet.publisher.age).toBe(age)

            let update = await updateUser(dataUpdated)
            expect(update).toBeUndefined()

            toilet = await Toilet.findById(_toiletId).populate('publisher', 'name surname age')
            user = await User.findById(_id)

            expect(user).toBeDefined()
            expect(user.name).toMatch(dataUpdated.name)
            expect(user.surname).toMatch(dataUpdated.surname)
            expect(user.age).toBe(dataUpdated.age)
            const validUpdated = await bcrypt.compare(dataUpdated.newPassword, user.password)
            expect(validUpdated).toBe(true)

            expect(toilet).toBeDefined()
            expect(toilet.publisher.name).toMatch(dataUpdated.name)
            expect(toilet.publisher.surname).toMatch(dataUpdated.surname)
            expect(toilet.publisher.age).toBe(dataUpdated.age)
        })

        it('should fail to update the user if the user is deactivated', async () => {
            await User.findByIdAndUpdate(_id, { $set: { deactivated: true } })

            let _error

            try {
                await updateUser(dataUpdated)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual(`user with id ${_id} is deactivated`)
        })

        it('should fail to update the user on wrong password', async () => {
            let _error
            await User.findByIdAndUpdate(_id, { $set: { deactivated: false } })
            dataUpdated.password = 'wrong-pasword'
            try {
                await updateUser(dataUpdated)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(Error)
            expect(_error.message).toEqual('wrong credentials')
        })

        it('should fail to update the user if the user does not exist', async () => {
            await User.deleteMany()

            let _error
            try {
                await updateUser(dataUpdated)
            } catch (error) {
                _error = error
            }
            expect(_error).toBeDefined()
            expect(_error).toBeInstanceOf(NotFoundError)
            expect(_error.message).toBe(`user with id ${_id} does not exist`)
        })
    })

    describe('unhappy paths', () => {
        it('should fail on a non-object data', () => {
            dataUpdated = 45438
            expect(() => updateUser(dataUpdated)).toThrow(`data ${dataUpdated} is not a Object`)

            dataUpdated = 'some string'
            expect(() => updateUser(dataUpdated)).toThrow(`data ${dataUpdated} is not a Object`)

            dataUpdated = false
            expect(() => updateUser(dataUpdated)).toThrow(`data ${dataUpdated} is not a Object`)

            dataUpdated = undefined
            expect(() => updateUser(dataUpdated)).toThrow(`data ${dataUpdated} is not a Object`)
        })

        // it('should fail on a non string new password, in case there is one', () => {
        //     token = 'some token'
        //     let dataUpdated = {
        //         newPassword: 45438,
        //         password: 'somepassword'
        //     }

        //     expect(() => updateUser(dataUpdated)).toThrow(`newPassword ${dataUpdated.newPassword} is not a string`)

        //     dataUpdated.newPassword = {}
        //     expect(() => updateUser(dataUpdated)).toThrow(`newPassword ${dataUpdated.newPassword} is not a string`)

        //     dataUpdated.newPassword = false
        //     expect(() => updateUser(dataUpdated)).toThrow(`newPassword ${dataUpdated.newPassword} is not a string`)

        //     dataUpdated.newPassword = [1, 2, 3]
        //     expect(() => updateUser(dataUpdated)).toThrow(`newPassword ${dataUpdated.newPassword} is not a string`)

        //     dataUpdated.newPassword = undefined
        //     expect(() => updateUser(dataUpdated)).toThrow(`newPassword is empty`)
        // })
    })

    afterAll(async () => {
        await User.deleteMany()
        await Toilet.deleteMany()
        await Comment.deleteMany()
        await mongoose.disconnect()
    })
})