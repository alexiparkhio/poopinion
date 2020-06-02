require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveTopToilets = require('./retrieve-top-toilets')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('retrieveTopToilets', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()]))
            .then(() => { })
    )

    let name, name2, surname, surname2, email, email2, password, password2, age, age2, gender, gender2, _id, _id2, place2, _toiletId, _toiletId2, _commentId, _commentId2, place, rating = {}, rating2 = {}
    const GENDERS = ['male', 'female', 'non-binary']
    const YESORNO = [true, false]

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        age = floor(random() * 120)
        gender2 = GENDERS[floor(random() * GENDERS.length)]
        name2 = `name2-${random()}`
        surname2 = `surname2-${random()}`
        email2 = `email2-${random()}@mail.com`
        password2 = `password2-${random()}`
        age = floor(random() * 120)
        age2 = floor(random() * 120)
        gender = GENDERS[floor(random() * GENDERS.length)]
        gender2 = GENDERS[floor(random() * GENDERS.length)]
        place = `house of ${name}`
        place2 = `house of ${name2}`

        rating.cleanness = floor(random() * 5)
        rating.looks = floor(random() * 5)
        rating.multipleToilets = YESORNO[floor(random() * YESORNO.length)]
        rating.paymentRequired = YESORNO[floor(random() * YESORNO.length)]
        rating.paperDeployment = YESORNO[floor(random() * YESORNO.length)]
        rating.overallRating = floor(random() * 5)
        rating.textArea = `opinion-${random()}`

        rating2.cleanness = floor(random() * 5)
        rating2.looks = floor(random() * 5)
        rating2.multipleToilets = YESORNO[floor(random() * YESORNO.length)]
        rating2.paymentRequired = YESORNO[floor(random() * YESORNO.length)]
        rating2.paperDeployment = YESORNO[floor(random() * YESORNO.length)]
        rating2.overallRating = floor(random() * 5)
        rating2.textArea = `opinion2-${random()}`
    })

    describe('when user and the toilet post exist', () => {
        beforeEach(() =>
            Promise.all([User.create({ name, surname, email, password, age, gender }), User.create({ name: name2, surname: surname2, email: email2, password: password2, age: age2, gender: gender2 })])
                .then(([user, user2]) => {
                    _id = user.id.toString()
                    _id2 = user2.id.toString()
                })
                .then(() => Promise.all([Toilet.create({ publisher: _id, place }), Toilet.create({ publisher: _id2, place: place2 }), User.findById(_id), User.findById(_id2)]))
                .then(([toilet, toilet2, user, user2]) => {
                    _toiletId = toilet.id.toString()
                    _toiletId2 = toilet2.id.toString()

                    user.publishedToilets.push(toilet)
                    user2.publishedToilets.push(toilet2)

                    return Promise.all([user.save(), user2.save()])
                })
                .then(() => Promise.all([Comment.create({ publisher: _id, commentedAt: _toiletId, rating }), Comment.create({ publisher: _id2, commentedAt: _toiletId2, rating: rating2 }), Toilet.findById(_toiletId), Toilet.findById(_toiletId2), User.findById(_id), User.findById(_id2)]))
                .then(([comment, comment2, toilet, toilet2, user, user2]) => {
                    _commentId = comment.id.toString()
                    _commentId2 = comment2.id.toString()

                    toilet.comments.push(comment)
                    toilet2.comments.push(comment2)

                    user.comments.push(comment)
                    user2.comments.push(comment2)

                    return Promise.all([toilet.save(), toilet2.save(), user.save(), user2.save()])
                })
                .then(() => { })
        )

        it('should successfully retrieve all toilets and sort them by rating', () => {
            return retrieveTopToilets()
                .then(toilets => {
                    expect(toilets.length).to.equal(2)
                    expect(toilets).to.be.instanceOf(Array)

                    expect(toilets[0].score > toilets[1].score).to.be.true

                    if (toilets[0].comments[0].rating.textArea === rating.textArea) {
                        const t = toilets[0]

                        expect(t).to.be.instanceOf(Object)
                        expect(t.place).to.equal(place)
                        expect(t.publisher.id.toString()).to.equal(_id)
                        expect(t.publisher.name).to.equal(name)
                        expect(t.publisher.surname).to.equal(surname)
                        expect(t.comments[0].id.toString()).to.equal(_commentId)
                        expect(t.comments[0].rating).to.be.instanceOf(Object)
                        expect(t.comments[0].rating.cleanness).to.equal(rating.cleanness)
                        expect(t.comments[0].rating.looks).to.equal(rating.looks)
                        expect(t.comments[0].rating.multipleToilets).to.equal(rating.multipleToilets)
                        expect(t.comments[0].rating.paymentRequired).to.equal(rating.paymentRequired)
                        expect(t.comments[0].rating.paperDeployment).to.equal(rating.paperDeployment)
                        expect(t.comments[0].rating.overallRating).to.equal(rating.overallRating)
                    } else {
                        const t = toilets[0]

                        expect(t).to.be.instanceOf(Object)
                        expect(t.place).to.equal(place2)
                        expect(t.publisher.id.toString()).to.equal(_id2)
                        expect(t.publisher.name).to.equal(name2)
                        expect(t.publisher.surname).to.equal(surname2)
                        expect(t.comments[0].id.toString()).to.equal(_commentId2)
                        expect(t.comments[0].rating).to.be.instanceOf(Object)
                        expect(t.comments[0].rating.cleanness).to.equal(rating2.cleanness)
                        expect(t.comments[0].rating.looks).to.equal(rating2.looks)
                        expect(t.comments[0].rating.multipleToilets).to.equal(rating2.multipleToilets)
                        expect(t.comments[0].rating.paymentRequired).to.equal(rating2.paymentRequired)
                        expect(t.comments[0].rating.paperDeployment).to.equal(rating2.paperDeployment)
                        expect(t.comments[0].rating.overallRating).to.equal(rating2.overallRating)
                    }
                })
                .then(() => { })
        })

    })

    describe('when there are no toilets', () => {
        beforeEach(() => Promise.resolve(Toilet.deleteMany()).then(() => { }))

        it('should return an empty array if no toilets are available to display', () => {

            return retrieveTopToilets()
                .then(toilets => {
                    expect(toilets).to.be.instanceOf(Array)
                    expect(toilets.length).to.equal(0)
                })
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})