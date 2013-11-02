var debug        = require('debug')('homy:build')
  , copyfile     = require('./lib/copyfile')
  , Glob         = require('glob').Glob
  , resolve      = require('path').resolve
  , relative     = require('path').relative
  , join         = require('path').join
  , fs           = require('fs')
  , async        = require('async')
  , lcb          = require("when/node/function").liftCallback
;


var dest  = join(__dirname, './dist/homy');
var base  = __dirname;
var pattern ="{/app/**,/vendor/**,/bower_components/**,/manifest.json,/LICENSE,/README.md}";

var g = new Glob(pattern, {cwd: base, root: base}, function (er, files) {
  var statCache = g.statCache;

  async.mapSeries(files, function(input, done) {
    var statInput  = statCache[input] || (statCache[input] = fs.statSync(input));

    if(statInput.isDirectory()) {
      debug('Ignore (directory)  : "%s"',relative(base,input));
      return done();
    }

    var output = join(dest,relative(base,input));

    try {
      if(fs.statSync(output).mtime.getTime() === statInput.mtime.getTime()) {
        debug('Ignore (no changes) : "%s"',relative(base,input));
        return done();
      }
    } catch(e) {};

    debug("copy %s -> %s", relative(base,input), relative(base,output));

    async.series([
      // Copy file
      function(done) {
          copyfile(input, output).then(lcb(done));
      },
      // Update copied file mtime
      function(done) {
        debug('Copy mtime')
        fs.utimes(output, statInput.atime, statInput.mtime, done);
      }
    ], done);

  },function(err, result) {
    debug('DONE');
  })

});

