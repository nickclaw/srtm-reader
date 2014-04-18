function GraduatedArray() {
    return Array.prototype.constructor.apply(this, arguments);
};

GraduatedArray.prototype = new Array();

GraduatedArray.prototype.get = function(index) {
    if (index > this.length - 1 || index < 1) throw "Index not in range.";

    var floor = Math.floor(index),
        ceiling = Math.ceil(index),
        fVal = this[floor],
        cVal = this[ceiling];

    if (floor === ceiling) return fVal;

    return (cVal - fVal)/(ceiling - floor)*(index - floor)+fVal;
}

module.exports = GraduatedArray;
