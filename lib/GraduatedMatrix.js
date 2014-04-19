/**
 * The GraduatedMatrix is much like a GrduatedArray except
 * it's get method calculates the value between indexs on
 * the x and y axis
 */
function GraduatedMatrix() {
    return Array.prototype.constructor.apply(this, arguments);
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

}

module.exports = GraduatedMatrix;
