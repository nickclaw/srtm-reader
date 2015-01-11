var path = require('path'),
    loc = require('../index.js');

var testLat = 47.234,
    testLong = -122.234;

var quadrant = new loc.Quadrant({
    filename: path.join(__dirname, './N47W123.hgt')
});

quadrant.read(testLat, testLong, function(err, height) {
    console.log('Possible error: ' + err);
    console.log('Height using quadrant.read: ' + height);
});

console.log('A 3" SRTM file has file size ' + quadrant._fileSize());
console.log('A point near the upper left corner (47.9999, -122.9999) is in the first cell at the beginning of the file, offset ' + quadrant._getOffset(47.9999, -122.9999));
console.log('A point near the lower right corner (47.0001, -122.0001) is in the last cell at the last two bytes of the file, offset ' + quadrant._getOffset(47.0001, -122.0001));

quadrant.load(function(err, matrix) {
    console.log(matrix.length);
    console.log(matrix[matrix.length - 1].length);
    console.log('Height using quadrant.load: ' + matrix.getAtCoords(quadrant, testLat, testLong));
});

var a = new loc.GraduatedArray(),
    b = new loc.GraduatedArray(),
    c = new loc.GraduatedMatrix();

a.push(91); a.push(210);
b.push(162); b.push(95);
c.push(a); c.push(b);

console.log(c);

console.log(c.get(.2, .5)); // Using bilinear interpolation, should yield 146.1

console.log(quadrant);

quadrant.each(function(err, lat, long, el) {
    var latDiff = Math.abs(lat - testLat);
    var longDiff = Math.abs(long - testLong);

    if (latDiff < .0004 && longDiff < .0004)
        console.log('Height using quadrant.each: ' + el + ' -- diffs ' + latDiff + ' ' + longDiff);
});
