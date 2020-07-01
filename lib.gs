function arrayCombine(keys, values) {
    var result = {};
    for (var i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }
    return result;
}

function arrayRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
    return min + (Math.random() * (max - min));
}