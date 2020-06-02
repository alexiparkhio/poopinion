const context = require('./context')

module.exports = async function () {
    const token = await this.storage.getItem('token')

    return !!token
}.bind(context)