var fs = require('fs')
  , jade = require('jade')
  , juice = require('juice')
  , INCLUDES = [
        'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-doc/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-body/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-section/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-bulletproof-button/index').filepath
      , '' // leave last index empty for final `\n`
    ]
  , buffer = new Buffer(INCLUDES.join('\n'))
;

var mkdir = function mkdir() {
  console.error('directory mgmt not yet implemented!');
}

var render = function render() {

  var inline = function inline(html) {
    var css = fs.readFileSync(process.cwd() + '/public/styles/screen.css').toString();
    process.stdout.write(juice.inlineContent(html, css));
  };

  var init = function init() {
    var source = buffer.toString()
      , options = {
          pretty: true
        , basedir: '/'
      }
      , html = jade.render(source, options)
    ;
    inline(html);
  };

  process.stdin
    .on('readable', function() {
      while (chunk = this.read())
        buffer = Buffer.concat([buffer, chunk]);
    })
    .on('finish', init)
  ;
}

if (process.argv[2])
  mkdir();
else
  render();

