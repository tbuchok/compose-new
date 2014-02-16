var http = require('http')
  , fs = require('fs')
  , ComposeNew = require('./lib/compose-new')
;

var init = function() {
  var server = http.createServer(function(req, res) {
    fs.createReadStream(process.cwd() + '/src/email.jade')
      .pipe(new ComposeNew)
      .pipe(res)
    ;
  }).listen(3000);
  console.log('compose new server listening on 3000');  
}


exports.init = init;