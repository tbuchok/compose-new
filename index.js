var jade = require('jade')
  , INCLUDES = [
        'include ' + require('jade-email-doc').filepath
      , 'include ' + require('jade-email-body').filepath
      , 'include ' + require('jade-email-section').filepath
      , 'include ' + require('jade-bulletproof-button').filepath
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

