var Transform = require('stream').Transform
  , util = require('util')
  , fs = require('fs')
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
function ComposeNew(options) {
  options = options || {};
  this.buffer = new Buffer(INCLUDES.join('\n'))
  Transform.call(this, options);
}

ComposeNew.prototype._transform = function(chunk, enc, next) {
  this.buffer = Buffer.concat([this.buffer, chunk]);
  next();
}

ComposeNew.prototype._flush = function(done) {
  var self = this
    , source = this.buffer.toString()
    , options = {
        pretty: true
      , basedir: '/'
    }
    , html = jade.render(source, options)
    , stylesheet = process.cwd() + '/public/styles/screen.css'
  ;
  fs.readFile(stylesheet, function(err, data) {
    if (err)
      return done(err);
    data = Buffer.concat([defaultCss, data]);
    var options = {   url: stylesheet
                    , removeStyleTags: false
                    , removeLinkTags: false
                    , extraCss: data.toString()
                  };
    juice.juiceContent(html, options, function(err, result) {
      if (err)
        return done(err);
      self.push(result);
      done();
    });
  });
}

module.exports = ComposeNew;