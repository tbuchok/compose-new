var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , ComposeNew = require('./compose-new')
  , IMAGE_EXTS = ['.jpg', '.png', '.gif']
;

var init = function(dataJSONFilePath) {
  var server = http.createServer(function(req, res) {
    if (IMAGE_EXTS.indexOf(path.extname(req.url)) > -1)
      return fs.createReadStream(path.join(process.cwd(), 'public', 'images', path.basename(req.url))).pipe(res);
    fs.createReadStream(process.cwd() + '/src/email.jade')
      .pipe(new ComposeNew(dataJSONFilePath))
      .on('error', function(err) {
        res.end(err.message);
      })
      .pipe(res)
    ;
  }).listen(3000);
  console.log('compose new server listening on 3000');  
}


exports.init = init;