var Readable = require('readable-stream').Readable;
var util = require('util');

var d2r = Math.PI / 180;

function pointToTileFrac(lon, lat, z) {
  var sin = Math.sin(lat * d2r),
    z2 = Math.pow(2, z),
    x = ~~(z2 * (lon / 360 + 0.5)),
    y = ~~(z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI));
  if (x === z2) x = z2 - 1;
  if (y === z2) y = z2 - 1;
  return [x, y, z];
}

function TileGenerator(zoom, bbox, options) {
  options = options || {};
  options.objectMode = true;
  if (!bbox) bbox = [-180, -85, 180, 85];

  Readable.call(this, options);

  this.zoom = zoom;
  var sw = pointToTileFrac(bbox[0], bbox[1], zoom);
  var ne = pointToTileFrac(bbox[2], bbox[3], zoom);

  this.startX = sw[0];
  this.endX = ne[0];
  this.startY = ne[1];
  this.endY = sw[1];
  this.currX = this.startX - 1;
  this.currY = this.startY;
}
util.inherits(TileGenerator, Readable);

TileGenerator.prototype.nextValue = function () {
  this.currX++;
  if (this.currX > this.endX) {
    this.currX = this.startX;
    this.currY++;
  }
  if (this.currY > this.endY) return null;

  return [this.currX, this.currY, this.zoom];
};

TileGenerator.prototype._read = function () {
  var next = this.nextValue();
  return this.push(next);
};

module.exports = TileGenerator;
