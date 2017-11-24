module.exports = function global(value) {
  if (typeof value === 'string') {
    return 'global::' + value
  } else {
    return value
  }
}
