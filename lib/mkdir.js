var fs = require('fs')
  , path = require('path')
  , PUBLIC_PATH = path.join(process.cwd(), 'public')
  , BUILD_PATH = path.join(process.cwd(), 'build')
  , DATA_JSON = path.join(path.join(PUBLIC_PATH, 'data.json'))
  , STYLES_PATH = path.join(PUBLIC_PATH, 'styles')
  , SCREEN_CSS = path.join(STYLES_PATH, 'screen.css')
  , SRC_PATH = path.join(process.cwd(), 'src')
  , EMAIL_JADE = path.join(SRC_PATH, 'email.jade')
;

var init = function() {
  console.log('creating', BUILD_PATH, '...');
  try { fs.mkdirSync(BUILD_PATH); } catch(err) { console.error(err) }

  console.log('creating', PUBLIC_PATH, '...');
  try { fs.mkdirSync(PUBLIC_PATH); } catch(err) { console.error(err) }
  console.log('creating', DATA_JSON, '...');
  try { fs.writeFileSync(DATA_JSON, new Buffer(''), { flag: 'wx' }); } catch(err) { console.error(err) }

  console.log('creating', STYLES_PATH, '...');
  try { fs.mkdirSync(STYLES_PATH); } catch(err) { console.error(err) }
  console.log('creating', SCREEN_CSS, '...');
  try { fs.writeFileSync(SCREEN_CSS, new Buffer(''), { flag: 'wx' }); } catch(err) { console.error(err) }

  console.log('creating', SRC_PATH, '...');
  try { fs.mkdirSync(SRC_PATH); } catch(err) { console.error(err) }
  console.log('creating', EMAIL_JADE, '...');
  try { fs.writeFileSync(EMAIL_JADE, new Buffer(''), { flag: 'wx' }); } catch(err) { console.error(err) }
}

exports.init = init;