require('dotenv').config()
const { publishToilet } = require('../logic')
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { env: { TEST_MONGODB_URL } } = process
const { random } = Math

mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => 
    publishToilet('5e661a8b0e441602a05da427', 'El retrete de Skylab')
    .then(() => 
        User.findById('5e661a8b0e441602a05da427').populate('publishedToilets')
    ).then(result => console.log(result))
)
.then(() => User.deleteMany().then(() => mongoose.disconnect()))