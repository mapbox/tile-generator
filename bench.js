var Benchmark = require('benchmark');
var tileGenerator = require('./');
var tileCover = require('tile-cover');
var bboxPolygon = require('turf-bbox-polygon');

var bbox = [
  -77.16110229492188,
  38.785133984236815,
  -76.89056396484375,
  38.997841307500714
];
var bboxGeometry = bboxPolygon(bbox).geometry;

var suite = new Benchmark.Suite('tile-generator');
suite
  .add('tile-generator#tile-cover control', function () {
    var tiles = tileCover.tiles(bboxGeometry, {min_zoom: 18, max_zoom: 18});
  })
  .add('tile-generator#tile-generator', function (deferred) {
    var tiles = [];
    tileGenerator(bbox, 18)
      .on('data', function (dt) {
        tiles.push(dt);
      })
      .on('end', function () {
        deferred.resolve();
      });
  }, {defer: true})
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {

  })
  .run();
