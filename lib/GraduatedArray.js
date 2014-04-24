/**
 * The GraduatedArray is an array of numbers that extends javascript
 * arrays. In addition to normal array operations, it is possible to
 * calculate values between indexes using the get method.
 */
function GraduatedArray() {
    Array.prototype.constructor.apply(this, arguments);
};
GraduatedArray.prototype = new Array();

/**
 * Gets the value at the index
 * @param {Number} index can be double or integer
 * @throw "Index out of range" if index doesn't fall within array
 * @return {Number}
 */
GraduatedArray.prototype.get = function(index) {
    if (index > this.length || index < 0) throw "Index out of range.";

    var floor = Math.floor(index),
        ceiling = Math.ceil(index),
        fVal = this[floor],
        cVal = this[ceiling];

    if (floor === ceiling) return fVal;

    return (cVal - fVal)/(ceiling - floor)*(index - floor)+fVal;
}

module.exports = GraduatedArray;
