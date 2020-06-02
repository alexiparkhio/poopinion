const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    publisher: { type: ObjectId, required: true, ref: 'User' },
    created: { type: Date, required: true, default: Date.now },
    commentedAt: { type: ObjectId, required: true, ref: 'Toilet' },
    rating: {
        type: {
            cleanness: { type: Number, required: true },
            looks: { type: Number, required: true },
            multipleToilets: { type: Boolean, required: true },
            paymentRequired: { type: Boolean, required: true },
            paperDeployment: { type: Boolean, required: true },
            overallRating: { type: Number, required: true },
            textArea: { type: String }
        }
    },
    thumbsUp: [{ type: ObjectId, ref: 'User' }],
    thumbsDown: [{ type: ObjectId, ref: 'User' }]
})