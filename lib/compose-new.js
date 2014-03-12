var Transform = require('stream').Transform
  , util = require('util')
  , fs = require('fs')
  , path = require('path')
  , jade = require('jade')
  , juice = require('juice')
  , INCLUDES = [
        'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-doc/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-body/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-section/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-bulletproof-button/index').filepath
      , '' // leave last index empty for final `\n`
    ]
  , defaultCss = fs.readFileSync(__dirname + '/../files/default.css')
;

util.inherits(ComposeNew, Transform);
function ComposeNew(dataJSONFilePath, options) {
  options = options || {};
  this.buffer = new Buffer(INCLUDES.join('\n'))
  var dataFile =  dataJSONFilePath ||  '/public/data.json';
  this.dataJSONFilePath = path.join(process.cwd(), dataFile);
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
      , filename: process.cwd() + '/src/foo'
      , data: {}
    }
    , stylesheetUrl = process.cwd() + '/public/styles/screen.css'
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
                      };
      juice.juiceContent(html, cssOptions, handleCssInline);
    });
  };
  fs.readFile(this.dataJSONFilePath, function(err, data) {
    // `err` no 'data.json', that's okay. its not required.
    if (data && data.length > 0)
      jadeOptions.data = JSON.parse(data.toString());
    jade.render(source, jadeOptions, handleJadeRender);
  });
}

module.exports = ComposeNew;