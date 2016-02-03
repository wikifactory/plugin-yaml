var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('relink', function(cb) {
  // when developing in jspm use this to make changes linkable
  // in dependent project do:
  // jspm install --link yaml=github:wikifactory/plugin-yaml@master
  exec('jspm link github:wikifactory/plugin-yaml@master -y', function (err, stdout, stderr) {
    console.log(stdout) ;
    console.log(stderr);
    cb(err);
  });
  gulp.watch('**/*.js', ['relink']);
});
