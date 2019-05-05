import lodash from 'lodash-es'
var isUse = function () {
    console.log('isUse');
}

var isNotUse = function () {
    console.log('isNotUse');
}

var isArray = function (array) {
    return lodash.isArray(array);
}

export default {
    isNotUse,
    isUse,
    isArray
}