var debug              = require('debug')('homy:copyfile')
  , createReadStream   = require('fs').createReadStream
  , wsa                = require('./writestream-auto')
  , when               = require('when')
;


module.exports = function(input, output) {
  debug('Start:', input, output);

  var def = when.defer();

  var outputStream = wsa(output);
  outputStream
    .on('finish', def.resolve)

  createReadStream(input).pipe(outputStream);

  return def.promise;
}