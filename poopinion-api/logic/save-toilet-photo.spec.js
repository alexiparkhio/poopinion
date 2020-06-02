// require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
// const { expect } = require('chai')
// const { random, floor } = Math
// const fs = require('fs')
// const saveToiletPhoto = require('./save-toilet-photo')
// const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

// describe('saveToiletPhoto', () => {
//     before(() =>
//         mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//             .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
//             .then(() => { })
//     )

//     let name, surname, email, password, age, gender, _id, _toiletId, _commentId, place, rating = {}
//     const GENDERS = ['male', 'female', 'non-binary']
//     const YESORNO = [true, false]

//     beforeEach(() => {
//         name = `name-${random()}`
//         surname = `surname-${random()}`
//         email = `email-${random()}@mail.com`
//         password = `password-${random()}`
//         age = floor(random() * 120)
//         gender = GENDERS[floor(random() * GENDERS.length)]
//         place = `house of ${name}`
//         rating.cleanness = floor(random() * 5)
//         rating.looks = floor(random() * 5)
//         rating.multipleToilets = YESORNO[floor(random() * YESORNO.length)]
//         rating.paymentRequired = YESORNO[floor(random() * YESORNO.length)]
//         rating.paperDeployment = YESORNO[floor(random() * YESORNO.length)]
//         rating.overallRating = floor(random() * 5)
//         rating.textArea = `opinion-${random()}`
//     })

//     describe('when all user, toilet and comment exist', () => {

//         beforeEach(() =>
//             Promise.resolve(User.create({ name, surname, email, password, age, gender }))
//                 .then(({ id }) => _id = id)
//                 .then(() => Promise.resolve(Toilet.create({ publisher: _id, place })))
//                 .then(({ id }) => _toiletId = id)
//         )

//         it('should successfully retrieve the specified toilet post and show all info, including users and comments', () =>
//             saveToiletPhoto(_toiletId)
//                 .then(toilet => {
                    
//                     expect(toilet).to.exist
//                     expect(toilet).to.be.instanceOf(Object)
//                     expect(toilet.place).to.equal(place)

//                     expect(toilet.publisher).to.be.instanceOf(Object)
//                     expect(toilet.publisher.name).to.equal(name)
//                     expect(toilet.publisher.surname).to.equal(surname)
//                     expect(toilet.publisher.email).to.equal(email)
//                     expect(toilet.publisher.age).to.equal(age)
//                     expect(toilet.publisher.gender).to.equal(gender)
                    
//                     expect(toilet.comments).to.be.instanceOf(Array)
//                     expect(toilet.comments[0]).to.be.instanceOf(Object)
//                     expect(toilet.comments[0].publisher.toString()).to.equal(_id)
//                     expect(toilet.comments[0].commentedAt.toString()).to.equal(_toiletId)
//                     expect(toilet.comments[0].rating.cleanness).to.equal(rating.cleanness)
//                     expect(toilet.comments[0].rating.looks).to.equal(rating.looks)
//                     expect(toilet.comments[0].rating.multipleToilets).to.equal(rating.multipleToilets)
//                     expect(toilet.comments[0].rating.paperDeployment).to.equal(rating.paperDeployment)
//                     expect(toilet.comments[0].rating.paymentRequired).to.equal(rating.paymentRequired)
//                     expect(toilet.comments[0].rating.overallRating).to.equal(rating.overallRating)
//                     expect(toilet.comments[0].rating.textArea).to.equal(rating.textArea)
//                 })
//                 .then(() => { })
//         )
//     })

//     describe('when the toilet does not exist', () => {
//         beforeEach(() =>
//             Toilet.deleteMany()
//                 .then(() => User.findByIdAndUpdate(_id, { $set: { deactivated: false } }))
//                 .then(() => { })
//         )

//         it('should fail to retrieve the toilet post on a non-existing toilet', () =>
//             saveToiletPhoto(_toiletId)
//                 .then(() => { throw new Error('should not reach this point') })
//                 .catch(({ message }) => {
//                     expect(message).not.to.be.undefined
//                     expect(message).to.equal(`toilet with id ${_toiletId} does not exist`)
//                 })
//                 .then(() => { })
//         )
//     })

//     describe('unhappy paths', () => {
//         it('should fail on a non-string toilet id', () => {
//             _toiletId = 9328743289
//             expect(() => saveToiletPhoto(_toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

//             _toiletId = false
//             expect(() => saveToiletPhoto(_toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

//             _toiletId = undefined
//             expect(() => saveToiletPhoto(_toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

//             _toiletId = []
//             expect(() => saveToiletPhoto(_toiletId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)
//         })
//     })

//     after(() =>
//         Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
//             .then(() => mongoose.disconnect())
//     )
// })