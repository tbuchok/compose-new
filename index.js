var ComposeNew = require('./lib/compose-new')
  , server = require('./lib/server')
  , mkdir = require('./lib/mkdir')
  , build = require('./lib/build')
  , program = require('commander')
  , package = require('./package.json')
;

if (require.main !== module)
  return module.exports = ComposeNew;

program
  .version(package.version)
  .option('-s, --server', 'start the server')
  .option('-c, --create', 'create new `dev` directory at cwd')
  .option('-b, --build', 'build all `jade` files in /src dir and place into /build')
  .parse(process.argv)
;

if (program.server)
  return server.init();

if (program.create)
  return mkdir.init();

if (program.build)
  return build.init();

process.stdin
  .pipe(new ComposeNew)
  .pipe(process.stdout)
;