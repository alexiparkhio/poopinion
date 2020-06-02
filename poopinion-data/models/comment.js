const mongoose = require('mongoose')
const { comment } = require('../schemas')

module.exports = mongoose.model('Comment', comment)