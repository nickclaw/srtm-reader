/**
 * The GraduatedMatrix is much like a GrduatedArray except
 * it's get method calculates the value between indexs on
 * the x and y axis
 */
function GraduatedMatrix() {
    Array.prototype.constructor.apply(this, arguments);
}
GraduatedMatrix.prototype = new Array();

/**
 * Gets the value at the index
 * @param {Number} x
 * @param {Number} y
 * @throw "Index out of range" if index doesn't fall within array
 * @return {Number}
 */
GraduatedMatrix.prototype.get = function(x, y) {
    if (x < 0 || x > this.length
        || y < 0 || y > this.length) throw "Index out of range.";

    var floor = Math.floor(x),
        ceiling = Math.ceil(x),
        fVal = this[floor].get(y),
        cVal = this[floor].get(y);

    if (floor === ceiling) return fVal;

    return (cVal - fVal)/(ceiling - floor)*(x - floor)+fVal;
}

module.exports = GraduatedMatrix;
