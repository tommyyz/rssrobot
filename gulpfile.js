"use strict";

var gulp = require('gulp')
,   watch = require('gulp-watch')
,	ts = require('gulp-typescript')
,   fs = require('fs')
,   path = require('path')
,	_ = require('underscore')
,   util = require('util')
,   t = util.format
,   P = require('bluebird')
,   subprocess = require('child_process')
,   exec = P.promisify(subprocess.exec)

,   PROJECT_ROOT = path.join(__dirname)
,   SRC = path.join(PROJECT_ROOT, 'src')
;

var tasks = {

  /**
   * Removes all build and runtime artifacts from the project
   * @param void
   * @return {Promise}
   */
  clean: function() {
	return P.resolve();
  },
  
  /**
   * Compile Typescript code to Javascript
   * @param void
   * @return {Promise}
   */
  ts2js: function() {
    var started_at = Date.now()
	,	src = path.join(SRC, '**/*.ts')
	,	dest = SRC

    return new P(function(resolve, reject) {
      gulp.src(src)
	    .pipe(ts({
            noImplicitAny: true,
            out: 'output.js',
            moduleResolution: 'node'
        }))
        .pipe(gulp.dest(dest))
		.once('end', function(err) {
			var duration = Date.now() - started_at;
			console.log('tasks.ts2js completed in %sms', duration);
			err ? reject(err) : resolve()
		});
    });
  },
  
  /**
   * Run other tasks whenever a change is made to the source tree
   * @param void
   * @return {Promise}
   */
  watch: function() {
    var timeout;
    console.log('watching ts files changes until terminal closed...');
    // watch recursively
    watch([path.join(SRC, '*.ts'), path.join(SRC, '**/*.ts')], function(vinyl) {
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          tasks.ts2js();
        }, 50);
      });

    // return a promise that does not resolve
    return new P(function(resolve, reject) {});
  },

  default: function() {}

};


gulp.task('clean', tasks.clean);
gulp.task('ts2js', ['clean'], tasks.ts2js);

gulp.task('watch', ['ts2js'], tasks.watch);
gulp.task('default', ['ts2js'], tasks.watch);

