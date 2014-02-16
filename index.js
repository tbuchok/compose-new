var ComposeNew = require('./lib/compose-new')
  , server = require('./server')
  , program = require('commander')
  , package = require('./package.json')
;

program
  .version(package.version)
  .option('-s, --server', 'start the server')
  .option('-c, --create', 'create new `dev` directory at cwd')
  .parse(process.argv)
;

if (program.server)
  return server.init();

process.stdin
  .pipe(new ComposeNew)
  .pipe(process.stdout)
;