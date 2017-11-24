module.exports = function toUpper(value) {
  if (typeof value === 'string') {
    return value.charAt(0).toUpperCase() + value.slice(1)
  } else {
    return ''
  }
}
