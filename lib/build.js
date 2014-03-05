var fs = require('fs')
  , path = require('path')
  , ComposeNew = require('./compose-new')
  , BUILD_PATH = path.join(process.cwd(), 'build')
  , SOURCE_PATH = path.join(process.cwd(), 'src')
;


var init = function() {
  fs.readdir(SOURCE_PATH, function(err, sources) {
    sources
      .filter(function(s) { return path.extname(s) == '.jade' })
      .forEach(function(s) {
        var name = path.basename(s, '.jade') + '.build.html'
          , sourceFile = path.join(SOURCE_PATH, s)
          , buildFile = path.join(BUILD_PATH, name);
        ;
        fs
          .createReadStream(sourceFile)
          .pipe(new ComposeNew)
          .pipe(fs.createWriteStream(buildFile))
        ;
      })
    ;
  });
};

exports.init = init;


