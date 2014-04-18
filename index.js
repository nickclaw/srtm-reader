var fs = require('fs');

function readHgt(lat, long, callback) {
    var numBytes = 2,
        row = Math.floor(Math.abs(lat % 180) * 1201),
        column = Math.floor(Math.abs(long % 180) * 1201),
        offset = (row * 1201 + column) * numBytes,
        buffer = new Buffer(numBytes);

    fs.open('./files/N47W122.hgt', 'r', function(err, fd) {

        fs.fstat(fd, function(err, stats) {
            console.log('stats', stats);
            console.log('offset', offset);
        });

        fs.read(fd, buffer, 0, numBytes, offset, function(err, bytesRead, buffer) {
            console.log(buffer[1] + ',' + buffer[0], buffer[1] * 256 + buffer[0]);
            callback && callback(err, buffer[1] * 256 + buffer[0]);
        });
    });
}

readHgt(.5, .5);
