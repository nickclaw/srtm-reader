function GraduatedMatrix() {
    return Array.prototype.constructor.apply(this, arguments);
}

GraduatedMatrix.prototype = new Array();

GraduatedMatrix.prototype.get = function(x, y) {

}

module.exports = GraduatedMatrix;
