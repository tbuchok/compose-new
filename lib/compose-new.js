var Transform = require('stream').Transform
  , util = require('util')
  , fs = require('fs')
  , path = require('path')
  , jade = require('jade')
  , juice = require('juice')
  , INCLUDES = [
        'include ' + require(__dirname + '/../node_modules/jade-email-doc/index').filepath
      , 'include ' + require(__dirname + '/../node_modules/jade-email-body/index').filepath
      , 'include ' + require(__dirname + '/../node_modules/jade-email-section/index').filepath
      , 'include ' + require(__dirname + '/../node_modules/jade-bulletproof-button/index').filepath
      , '' // leave last index empty for final `\n`
    ]
  , defaultCss = fs.readFileSync(__dirname + '/../files/default.css')
;

util.inherits(ComposeNew, Transform);
function ComposeNew(data, filePath, options) {
  options = options || {};
  this.buffer = new Buffer(INCLUDES.join('\n'))
  this.data = data;
  this.filePath = filePath || process.cwd();
  var dataFile =  '/public/data.json';
  this.dataJSONFilePath = path.join(this.filePath, dataFile);
  Transform.call(this, options);
}

ComposeNew.prototype._transform = function(chunk, enc, next) {
  this.buffer = Buffer.concat([this.buffer, chunk]);
  next();
}

ComposeNew.prototype._flush = function(done) {
  var self = this
    , source = this.buffer.toString()
    , jadeOptions = {
        pretty: true
      , basedir: '/'
      , filename: self.filePath + '/src/foo'
      , data: {}
    }
    , stylesheetUrl = self.filePath + '/public/styles/screen.css'
  ;
  var handleCssInline = function(err, result) {
    if (err)
      return done(err);
    self.push(result);
    done();
  }

  var handleJadeRender = function(err, html) {
    if (err)
      return done(err);
    fs.readFile(stylesheetUrl, function(err, screenCss) {
      if (err)
        return done(err);

      var cssOptions = {   url: stylesheetUrl
                        , removeStyleTags: false
                        , removeLinkTags: false
                        , extraCss: Buffer.concat([defaultCss, screenCss]).toString()
                        , webResources: { images: false }
                      };
      juice.juiceResources(html, cssOptions, handleCssInline);
    });
  };
  if (self.data) {
    jadeOptions.data = self.data;
    return jade.render(source, jadeOptions, handleJadeRender);
  }

  fs.readFile(this.dataJSONFilePath, function(err, data) {
    // `err` no 'data.json', that's okay. its not required.
    if (data && data.length > 0)
      jadeOptions.data = JSON.parse(data.toString());
    jade.render(source, jadeOptions, handleJadeRender);
  });
}

module.exports = ComposeNew;
