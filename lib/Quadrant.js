var fs = require('fs'),
    path = require('path'),
    GraduatedArray = require('./GraduatedArray.js'),
    GraduatedMatrix = require('./GraduatedMatrix.js');

/**
 * Constructor
 * A quadrant represents a 1 x 1 degree square on earth.
 * @param {Object} options
 * @param {String}     options.filename        "N#E#.hgt"
 * @param {Integer?}   options.matrixSize      defaults to SRTM2 value
 * @param {Integer?}   options.lat             or converted from filename
 * @param {Integer?}   options.long            or converted from filename
 */
function Quadrant(options){
    if (!options.filename) throw "Filename must be supplied.";
    this.filename = options.filename;

    var name = path.basename(this.filename, '.hgt'),
        matches = name.match(/(N|S)(\d*)(E|W)(\d*)/);

    this.numBytes = 2;
    this.matrixSize = options.matrixSize || 1201;
    this.lat = options.lat || parseInt(matches[2]) * ( matches[1] === 'N' ? 1 : -1 );
    this.long = options.long ||  parseInt(matches[4]) * ( matches[3] === 'E' ? 1 : -1 );
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
 * Calculates the file size of the .htg file in bytes
 * @private
 * @return {Number} file size in bytes
 */
Quadrant.prototype._fileSize = function() {
    return this.matrixSize * this.matrixSize * this.numBytes;
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
    var row = Math.round( (lat - this.lat) * (this.matrixSize - 1) ),
        col = Math.round( (long - this.long) * (this.matrixSize - 1) );

    return this._fileSize() - ((row + 1) * this.matrixSize - col) * this.numBytes;
}

/**
 * Loads the entire quadrant into a GraduatedMatrix
 * @param {Function(error, matrix)} called on error or completion
 */
Quadrant.prototype.load = function(callback) {
    var size = this.matrixSize,
        matrix = new GraduatedMatrix(),
        array = new GraduatedArray();

    this
        .each(true, function(err, lat, long, el, row, column) {
            array.push(el);
            if (array.length === size) {
                matrix.push(array);
                array = new GraduatedArray();
            }
        })
        .on('end', function() {
            callback(null, matrix);
        });
}

/**
 * Iterates over the file passing a callback the
 * latitude, longitude, elevation, row, and column
 * because this function returns a stream you need to listen for the stream
 * 'end' event before the loop is done
 *
 * @param {Boolean?} overlap defaults to false
 * @param {Function} callback called for every datapoint
 * @return {Stream}
 */
Quadrant.prototype.each = function(overlap, callback) {
    // make
    if (typeof overlap === 'function') {
        callback = overlap;
        overlap = false;
    }

    var size = this.matrixSize,
        limit = overlap ? size : size - 1,
        num = this.numBytes,
        lat = this.lat,
        long = this.long,
        rowCount = 0,
        colCount = 0,
        count = 0;

    var stream = fs.createReadStream(this.filename);
    return stream
        .on('readable', function() {
            var chunk;
            while (null !== (chunk = stream.read(num))) {

                if (rowCount < limit && colCount < limit) {

                    callback(
                        null,
                        lat + rowCount / limit,
                        long + colCount / limit,
                        chunk.readInt16BE(0),
                        rowCount,
                        colCount
                    );
                }

                if (++rowCount === size) {
                    rowCount = 0;
                    colCount++;
                }
            }
        })
        .on('error', function(err) {
            callback(err)
        });
}

module.exports = Quadrant;
