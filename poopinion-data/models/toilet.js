const mongoose = require('mongoose')
const { toilet } = require('../schemas')

module.exports = mongoose.model('Toilet', toilet)