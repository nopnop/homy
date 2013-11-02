var dirname            = require('path').dirname
  , exists             = require('fs').existsSync
  , createWriteStream  = require('fs').createWriteStream
  , mkdirp             = require('mkdirp')
  , resolve            = require('path').resolve
;


module.exports = function(output) {
  output     = resolve(output);
  var folder = dirname(output);
  if(!exists(folder)) {
    mkdirp.sync(folder);
  }
  return createWriteStream(output);
}