var fs = require('fs'),
    path = require('path'),
    GraduatedArray = require('./GraduatedArray.js'),
    GraduatedMatrix = require('./GraduatedMatrix.js');

/**
 * Constructor
 * A quadrant represents a 1 x 1 degree square on earth.
 */
function Quadrant(filename){
    var name = path.basename(filename, '.hgt'),
        matches = name.match(/(N|S)(\d*)(E|W)(\d*)/);

    this.numBytes = 2;
    this.matrixSize = 1201;
    this.lat = parseInt(matches[2]) * ( matches[1] === 'N' ? 1 : -1 );
    this.long = parseInt(matches[4]) * ( matches[3] === 'E' ? 1 : -1 );
    this.filename = filename;
}

/**
 * Read the height of one location
 * @param {Number} lat - the latitude
 * @param {Number} long - the longitude
 * @param {Function(error, height)} - called on completion or error
 */
Quadrant.prototype.read = function(lat, long, callback) {
    if (lat < this.lat || lat > this.lat + 1) return callback("Lat out of bounds");
    if (long < this.long || long > this.long + 1) return callback("Long out of bounds");

    var size = this.numBytes,
        buffer = new Buffer(size),
        offset = this._getOffset(lat, long);

    fs.open(this.filename, 'r', function(err, fd) {
        if (err) return callback(err, fd);

        fs.read(fd, buffer, 0, size, offset, function(err, bytesRead, buffer) {
            if (err) return callback(err, buffer);

            callback(null, buffer.readInt16BE(0));
        });
    });
}

/**
 * Calculates the position in the .htg file the data for the
 * longitude and latitude exists
 * @private
 * @param {Number} lat
 * @param {Number} long
 * @return {Number} the offset in the file the data exists
 */
Quadrant.prototype._getOffset = function(lat, long) {
    var row = Math.floor( (lat - this.lat) * this.matrixSize ),
        col = Math.floor( (long - this.long) * this.matrixSize )
        fileSize = this.matrixSize * this.matrixSize * this.numBytes;

    return fileSize - (row * this.matrixSize + col) * this.numBytes;
}

/**
 * Loads the entire quadrant into a GraduatedMatrix
 * @param {Function(error, matrix)} called on error or completion
 */
Quadrant.prototype.load = function(callback) {
    var size = this.matrixSize,
        num = this.numBytes,
        matrix = new GraduatedMatrix(),
        array = new GraduatedArray();

    var stream = fs.createReadStream(this.filename);
    stream.once('readable', function() {
        var chunk;
        while (null !== (chunk = stream.read(num))) {

            array.push(chunk.readInt16BE(0));
            if (array.length === size) {
                matrix.push(array);
                array = new GraduatedArray();
            }
        }

        callback(null, matrix);
    });
}

module.exports = Quadrant;
