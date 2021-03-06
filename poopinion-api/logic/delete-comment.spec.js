require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const deleteComment = require('./delete-comment')
const { mongoose, models: { User, Toilet, Comment } } = require('poopinion-data')

describe('deleteComment', () => {
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

    describe('when all user, toilet and comment exist', () => {

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

        it('should successfully delete a comment from the toilet post and remove its track from user and toilet', () => {
            return Promise.all([User.findOne({ comments: _commentId }).lean(), Toilet.findOne({ comments: _commentId }).lean()])
                .then(([user, toilet]) => {
                    expect(user).to.exist
                    expect(user.comments[0]._id.toString()).to.equal(_commentId)
                    expect(toilet).to.exist
                    expect(toilet.comments[0]._id.toString()).to.equal(_commentId)
                })
                .then(() => deleteComment(_id, _toiletId, _commentId))
                .then(() => Promise.all([User.findById(_id).lean(), Toilet.findById(_toiletId).lean()]))
                .then(([user, toilet]) => {
                    expect(user).to.exist
                    expect(user.comments.length).to.equal(0)
                    expect(toilet).to.exist
                    expect(toilet.comments.length).to.equal(0)
                })
                .then(() => { })
        })
    })

    describe('when the user does not exist', () => {
        beforeEach(() => User.deleteMany().then(() => { }))

        it('should fail to remove a comment on a non-existing user', () =>
            deleteComment(_id, _toiletId, _commentId)
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
            deleteComment(_id, _toiletId, _commentId)
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
            deleteComment(_id, _toiletId, _commentId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`toilet with id ${_toiletId} does not exist`)
                })
                .then(() => { })
        )
    })
    
    describe('when the comment does not exist', () => {
        beforeEach(() =>
            Promise.resolve(Toilet.create({ place, publisher: _id }))
                .then(({ id }) => _toiletId = id)
                .then(() => {
                    
                    return Comment.deleteMany()
                })
                .then(() => { })
        )

        it('should fail to attempt a comment removal on a non-existing comment', () =>
            deleteComment(_id, _toiletId, _commentId)
                .then(() => { throw new Error('should not reach this point') })
                .catch(({ message }) => {
                    expect(message).not.to.be.undefined
                    expect(message).to.equal(`comment with id ${_commentId} does not exist`)
                })
                .then(() => { })
        )
        afterEach(() => Promise.resolve(User.deleteMany()).then(() => { }))
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
            expect(() => deleteComment(_id, _toiletId, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = false
            expect(() => deleteComment(_id, _toiletId, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = undefined
            expect(() => deleteComment(_id, _toiletId, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)

            _id = []
            expect(() => deleteComment(_id, _toiletId, _commentId)).to.throw(TypeError, `id ${_id} is not a string`)
        })

        it('should fail on a non-string toilet id', () => {
            _toiletId = 9328743289
            expect(() => deleteComment(__id, _toiletId, _commentId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = false
            expect(() => deleteComment(__id, _toiletId, _commentId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = undefined
            expect(() => deleteComment(__id, _toiletId, _commentId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)

            _toiletId = []
            expect(() => deleteComment(__id, _toiletId, _commentId)).to.throw(TypeError, `toilet ID ${_toiletId} is not a string`)
        })

        it('should fail on a non-string comment id', () => {
            _commentId = 9328743289
            expect(() => deleteComment(__id, __toiletId, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = false
            expect(() => deleteComment(__id, __toiletId, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = undefined
            expect(() => deleteComment(__id, __toiletId, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)

            _commentId = []
            expect(() => deleteComment(__id, __toiletId, _commentId)).to.throw(TypeError, `comment ID ${_commentId} is not a string`)
        })
    })

    after(() =>
        Promise.all([User.deleteMany(), Toilet.deleteMany(), Comment.deleteMany()])
            .then(() => mongoose.disconnect())
    )
})