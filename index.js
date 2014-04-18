var path = require('path'),
    Quadrant = require('./lib/Quadrant.js');

var quadrant = new Quadrant(path.join(__dirname, '/files/N47W123.hgt'));

quadrant.read(47.606209, -122.332070, function(err, height) {
    console.log(err);
    console.log(height);
});

quadrant.load(function(err, matrix) {
    console.log(arguments);
});
