const { Schema, Types: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    place: { type: String, required: true },
    created: { type: Date, required: true, default: Date.now },
    publisher: { type: ObjectId, ref: 'User' },
    comments: [{ type: ObjectId, ref: 'Comment' }],
    isFavedBy: [{ type: ObjectId, ref: 'User' }],
    geolocation: {
        type: {
            latitude: { type: Number },
            longitude: { type: Number },
            latitudeDelta: { type: Number },
            longitudeDelta: { type: Number }
        }
    },
    image: { type: String },
    disabledToilet: { type: Boolean, required: true, default: false }
})