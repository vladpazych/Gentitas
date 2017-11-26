module.exports = function (dest, source) {
    for (var key in source) {
        if (typeof source[key] === 'object' && typeof dest[key] === 'object') { mergeObject(dest[key], source[key]) }
        else if (typeof source[key] === 'object') { dest[key] = source[key] }
        else { dest[key] = source[key] }
    }
}
