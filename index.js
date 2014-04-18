var fs = require('fs');

function readHgt(lat, long, callback) {
    var numBytes = 2,
        row = Math.floor(Math.abs(lat % 180) * 3601),
        column = Math.floor(Math.abs(long % 180) * 3601),
        offset = (row * 3601 + column) * numBytes,
        buffer = new Buffer(numBytes);

    console.log(offset + ' bytes.');

    fs.open('./files/N47W122.hgt', 'r', function(err, fd) {
        fs.read(fd, buffer, 0, numBytes, 10, function(err, bytesRead, buffer) {
            console.log(buffer[1]* 256 + buffer[0]);
        });
    });
}

readHgt(.5, .5);
