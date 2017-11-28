String.prototype.has = function (str, ignoreCase = true) {
  var thisStr = this.toString()
  if (ignoreCase) {
    thisStr = thisStr.toLowerCase()
    if (str) str = str.toLowerCase()
  }
  return thisStr.indexOf(str) !== -1;
}

String.prototype.matchAndGet = function (str) {
  var result = this.match(str)
  if (result) return result[1]
  return '';
}
