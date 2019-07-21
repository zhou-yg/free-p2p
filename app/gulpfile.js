const gulp = require('gulp');
const execSync = require('child_process').execSync;

const build = () =>   execSync('npm run build:desktop');

gulp.watch(['src/**/*.ts', 'src/**/*.js'], () => {
  execSync('npm run build:desktop');
});


exports.default = () => {
  build();
  console.log('build end');
}
