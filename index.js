var jade = require('jade')
  , INCLUDES = [
        'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-doc/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-body/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-email-section/index').filepath
      , 'include ' + require('/Users/tom/Documents/Hacker-School/jade-bulletproof-button/index').filepath
      , '' // leave last index empty for final `\n`
    ]
  , options = {
        pretty: true
      , basedir: '/'
    }
  , buffer = new Buffer(INCLUDES.join('\n'))
;

var mkdir = function mkdir() {
  console.error('directory mgmt not yet implemented!');
}

var render = function render() {
  var init = function init() {
    var source = buffer.toString();
    process.stdout.write(jade.render(source, options));
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

