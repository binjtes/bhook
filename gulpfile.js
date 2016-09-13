var gulp = require('gulp');
var replace = require('gulp-replace-task');
var args    = require('yargs').argv;
var fs      = require('fs');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jshint = require('gulp-jshint');
var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

// ajout des config js dans le projet
gulp.task('copylibs', function(done){
	gulp.src(['./node_modules/pouchdb-load/dist/pouchdb.load.min.js',
		'./node_modules/pouchdb/dist/pouchdb.min.js' ,
		'./node_modules/pouchdb-replication-stream/dist/pouchdb.replication-stream.min.js',
		'./node_modules/angular-translate/dist/angular-translate.min.js'
		])
		// Perform minification tasks, etc here
		.pipe(gulp.dest('./www/lib/')) 
		.on('end', done);

});

gulp.task('lint', function() {
  return gulp.src('./www/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('replace', function () {
	  // Get the environment from the command line
	  var env = args.env || 'localdev';

	  // Read the settings from the right file
	  var filename = env + '.json';
	  var settings = JSON.parse(fs.readFileSync('./config/' + filename, 'utf8'));


	// Replace each placeholder with the correct value for the variable.
	gulp.src('www/js/config.settings.js')
	  .pipe(replace({
	    patterns: [
	      {
	        match: 'API_URL',
	        replacement: settings.apiUrl
	      }
	    ]
	  }))
	  .pipe(rename('www/js/config.js'))
	  .pipe(gulp.dest(''));


	});


