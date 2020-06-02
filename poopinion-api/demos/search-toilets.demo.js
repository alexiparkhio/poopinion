require('dotenv').config()
const { publishToilet } = require('../logic')
const { mongoose, models: { User, Toilet } } = require('poopinion-data')
const { env: { TEST_MONGODB_URL } } = process
const { random } = Math
const router = require('../routes')

mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => 
    router.get
    
)
.then(() => User.deleteMany().then(() => mongoose.disconnect()))