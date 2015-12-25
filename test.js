var TileGenerator = require('./'),
  bboxPolygon = require('turf-bbox-polygon'),
  tileCover = require('tile-cover'),
  test = require('tap').test;

var bbox = [
  -77.16110229492188,
  38.785133984236815,
  -76.89056396484375,
  38.997841307500714
];

var sortFn = function (a, b) {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
};

[0, 10, 15, 18].map(function (zoom) {
  test('tile-generator -- DC at z' + zoom, function (t) {
    var cover = tileCover.tiles(bboxPolygon(bbox).geometry, {min_zoom: zoom, max_zoom: zoom});
    var tiles = [];
    new TileGenerator(zoom, bbox)
      .on('data', function (tile) {
        tiles.push(tile);
      })
      .on('end', function () {
        cover.sort(sortFn);
        tiles.sort(sortFn);
        t.deepEqual(cover, tiles, 'should be the same as tile-cover');
        t.equal(cover.length, tiles.length, 'has the same length as tile-cover - ' + tiles.length);
        t.end();
      });
  });
});

test('tile-generator -- no bbox runs the world', function (t) {
  var tiles = [];
  new TileGenerator(1)
    .on('data', function (tile) {
      tiles.push(tile);
    })
    .on('end', function () {
      t.equal(tiles.length, 4, 'world at z1 is 4 tiles');
      t.deepEqual(tiles, [
        [0, 0, 1],
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 1]
      ], 'should contain all z1 tiles');
      t.end();
    });
});
