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
    var file = /\//.test(req.url) ? 'email' : req.url;
    var filePath = path.join(process.cwd(), 'src', file + '.jade');
    fs.createReadStream(filePath)
      .on('error', function(err) {
        res.statusCode = 500;
        res.end(err.toString()); 
      })
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