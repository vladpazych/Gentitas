module.exports = function toLower(value) {
  if (typeof value === 'string') {
    return value.charAt(0).toLowerCase() + value.slice(1)
  } else {
    return ''
  }
}
