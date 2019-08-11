const gulp = require('gulp');
const execSync = require('child_process').execSync;

const build = () =>   execSync('npm run build:desktop');


gulp.watch([
  'src/common/native.ts',
  // 'src/fileManager/src/Api/Api.js',
  'src/**/*.ts',
  'src/**/*.js',
  'src/**/*.jsx'
], () => {
  return new Promise(resolve => {
    build()
    console.log('build end');
    resolve();
  });
});


exports.default = () => {
  build();
  console.log('build end');
}
