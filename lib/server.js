var http = require('http')
  , fs = require('fs')
  , ComposeNew = require('./compose-new')
;

var init = function(dataJSONFilePath) {
  var server = http.createServer(function(req, res) {
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