var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var htmlbuild = require('gulp-htmlbuild');
var ngAnnotate = require('gulp-ng-annotate');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var rev = require('gulp-rev');
var config = require('./config.js');
var browserSync = require('browser-sync').create();
var ftp = require( 'vinyl-ftp' );

if(gutil.env.prod === true) {
	config.env.isProduction = true;
}

function handleError(err) {
  console.log('ERROR : ', err.toString());
  this.emit('end');
}

gulp.task('del-scripts', function () {
  return del(config.folders.dist+config.dist.folders.scripts);
});

gulp.task('del-vendor', function () {
  return del.sync(config.folders.dist+config.dist.folders.vendor);
});

gulp.task('del-styles', function () {
  return del.sync(config.folders.dist+config.dist.folders.styles);
});

gulp.task('del-images', function () {
  return del.sync(config.folders.dist+config.dist.folders.images);
});

gulp.task('del-views', function () {
  return del.sync(config.folders.dist+config.dist.folders.views);
});

gulp.task('scripts', ['del-scripts'], function(){
	return gulp.src(config.env.isProduction ? config.dev.files.scripts : config.dev.files.scriptsMocks)
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(ngAnnotate())
	.on('error', handleError)
	.pipe(babel())
	.on('error', handleError)
	.pipe(concat(config.dist.files.scripts))
	.pipe(config.env.isProduction ? uglify() : gutil.noop())
	.pipe(config.env.isProduction ? rev() : gutil.noop())
	.pipe(gulp.dest(config.folders.dist+config.dist.folders.scripts))
	.pipe(browserSync.stream());
});

gulp.task('vendor', ['del-vendor'], function(){
	return gulp.src(config.dev.files.vendor.concat(config.env.isProduction ? [''] : config.dev.files.vendorMock))
	.pipe(concat(config.dist.files.vendor))
	.pipe(config.env.isProduction ? rev() : gutil.noop())
	.pipe(gulp.dest(config.folders.dist+config.dist.folders.vendor))
	.pipe(browserSync.stream());
});

gulp.task('styles', ['del-styles'], function () {
	return gulp.src(config.dev.files.css.concat(config.dev.files.sass))
	.pipe(sass())
	.on('error', sass.logError)
	.pipe(concat(config.dist.files.styles))
	.pipe(uncss({
		html: config.dev.files.views.concat(config.dev.files.index)
		}))
	.pipe(config.env.isProduction ? minifyCss() : gutil.noop())
	.pipe(config.env.isProduction ? rev() : gutil.noop())
	.pipe(gulp.dest(config.folders.dist+config.dist.folders.styles))
	.on('error', handleError)
	.pipe(browserSync.stream());
});

gulp.task('views', ['del-views'], function(){
	return gulp.src(config.dev.files.views)
	.pipe(flatten())
	.pipe(gulp.dest(config.folders.dist+config.dist.folders.views))
});

gulp.task('images', ['del-images'], function(){
	return gulp.src(config.dev.files.images)
	.pipe(gulp.dest(config.folders.dist+config.dist.folders.images))
});

gulp.task('build', ['scripts', 'styles',	'vendor',	'views', 'images'], function(){
	return gulp.src(config.dev.files.index)
	.pipe(htmlbuild({
    js: htmlbuild.preprocess.js(function (block) {
    	fs.exists(config.folders.dist+config.dist.folders.scripts, function(exists){
    		if(exists){
	    		block.write(config.dist.folders.scripts+fs.readdirSync(config.folders.dist+config.dist.folders.scripts)[0]);
	    	}
	      block.end();
	    });
    }),
    vendor: htmlbuild.preprocess.js(function (block) {
      fs.exists(config.folders.dist+'/'+config.dist.folders.vendor, function(exists){
      	if(exists){
      		block.write(config.dist.folders.vendor+fs.readdirSync(config.folders.dist+'/'+config.dist.folders.vendor)[0]);
      	}
      	block.end();
      });
    }),
    styles: htmlbuild.preprocess.css(function (block) {
    	fs.exists(config.folders.dist+'/'+config.dist.folders.styles, function(exists){
      	if(exists){
      		block.write(config.dist.folders.styles+fs.readdirSync(config.folders.dist+'/'+config.dist.folders.styles)[0]);
      	}
      	block.end();
      });
    })
  }))
  .on('error', handleError)
  .pipe(gulp.dest('./build'));
  writeHtaccess();
})

gulp.task('connect', ['build'],function() {
	browserSync.init({
		open: false,
    server: {
    	baseDir: config.folders.dist
    }
  });
});

gulp.task('watch-build', ['connect'], function(){
	gulp.watch(config.dev.files.scripts, ['scripts']);
	gulp.watch(config.dev.files.scriptMocks, ['scripts']);
	gulp.watch(config.dev.files.vendor, ['vendor']);
	gulp.watch(config.dev.files.sass, ['styles']);
	gulp.watch(config.dev.files.views, ['views']);
	gulp.watch(config.dev.files.images, ['images']);
	gulp.watch(config.dev.files.index, ['build']);
});

function writeHtaccess(){
	fs.writeFile('build/'+'.htaccess', 'RewriteEngine on\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule .* /new/index.html?url=$0 [QSA,L]', function (err) {
	  if (err) throw err;
	});
}

gulp.task('ftp-deploy', ['build'], function(){
	var conn = ftp.create( {
    host:     'mywebsite.tld',
    user:     'me',
    password: 'mypass',
    parallel: 10,
    log:      gutil.log
  });

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp.src( config.deploy(), { base: '.', buffer: false } )
    .pipe( conn.newer( '/public_html/new' ) ) // only upload newer files
    .pipe( conn.dest( '/public_html/new' ) );
});

gulp.task('default', ['watch-build']);