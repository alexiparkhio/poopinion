module.exports = function isValidDate(dateString) {
    const REGEX = /^\d{4}-\d{2}-\d{2}$/
    if (!dateString.match(REGEX)) return false
    var d = new Date(dateString)
    var dNum = d.getTime()
    if (!dNum && dNum !== 0) return false
    return d.toISOString().slice(0, 10) === dateString
}  