const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    newPassword: { type: String },
    created: { type: Date, required: true, default: Date.now },
    authenticated: { type: Date },
    deactivated: { type: Boolean, default: false },
    retrieved: { type: Date },
    favToilets: {
        type: [{ type: ObjectId, ref: 'Toilet' }]
    },
    comments: {
        type: [{ type: ObjectId, ref: 'Comment' }]
    },
    thumbsUp: [{ type: ObjectId, ref: 'Comment' }],
    thumbsDown: [{ type: ObjectId, ref: 'Comment' }],
    publishedToilets: {
        type: [{ type: ObjectId, ref: 'Toilet' }]
    }
})