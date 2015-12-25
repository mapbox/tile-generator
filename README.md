Generate a stream of XYZ tiles from a bounding box.

### install
```sh
npm install tile-generator
```

### usage

```js
var tileGenerator = require('tile-generator');

var tiles = [];
tileGenerator(12, [0, 30, 5, 35])
  .on('data', function (tile) {
    tiles.push(tile);
  })
  .on('end', function () {
	console.log(JSON.stringify(tiles);
  });
```

tile-generator can also generate a stream of tiles for the whole world (`[-180, -85, 180, 85]`):

```js
var tileGenerator = require('tile-generator');

tileGenerator(12)
  .on('data', function (tile) {
  	console.log(tile);
  });
