var fs = require('fs');

var numBytes = 2,
    matrixSize = 1201;

function getOffset(lat, long) {
    var rows = Math.floor( Math.abs(lat % 1) * matrixSize ),
        columns = Math.floor( Math.abs(long % 1) * matrixSize );

    return (rows * matrixSize + columns) * numBytes;
}

function readHgt(lat, long, callback) {
    var offset = getOffset(lat, long),
        buffer = new Buffer(numBytes);

    fs.open('./files/N47W123.hgt', 'r', function(err, fd) {

        fs.fstat(fd, function(err, stats) {
            console.log('stats', stats);
            console.log('offset', offset);
        });

        fs.read(fd, buffer, 0, numBytes, offset, function(err, bytesRead, buffer) {
            console.log(buffer[0] + ',' + buffer[1], buffer[0] * 256 + buffer[1]);
            callback && callback(err, buffer[0] * 256 + buffer[1]);
        });
    });
}

readHgt(47.606209, -122.332070);
