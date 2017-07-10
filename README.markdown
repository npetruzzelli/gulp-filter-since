# Gulp Filter Since

A gulp plugin that provides Gulp 4.x `since` filtering to Gulp 3.x+ tasks. 

Since gulp-filter-since is a plugin, it may be used with both `gulp.src()` and the `gulp-add-src` plugin. It was also developed as a companion to [**gulp3-last-run**](https://github.com/npetruzzelli/gulp3-last-run).

## Why?

Why not use [**vinyl-filter-since**](https://github.com/tunnckocore/vinyl-filter-since)?

vinyl-filter-since comes close to being what I needed/wanted but it wasn't quite there. As of this writting, vinyl-filter-since:

-   MUST HAVE
    -   it doesn't allow for a `null` or `undefined` value to be passed to it.
-   NICE TO HAVE
    -   it doesn't use the [same dependencies](https://github.com/gulpjs/vinyl-fs/blob/728df8e44706aaff43eb9022cd1f80527c5cf59d/package.json#L41-L44) as Gulp 4.x or the version of **vinyl-fs** it depends on. `^2.0.0`, which currently resolves to [`2.4.3`](https://github.com/gulpjs/vinyl-fs/tree/728df8e44706aaff43eb9022cd1f80527c5cf59d) 
    -   it is not automatically loaded by [**gulp-load-plugins**](https://github.com/jackfranklin/gulp-load-plugins)

gulp-filter-since was developed to provide the same experience that gulp 4.x provides, right down to the dependencies and logic used. Not allowing for null or undefined values was the significant blocker here. 

In addition to leveraging filtering available to Gulp 4.x in Gulp 3.x, this plugin has the benefit of not being attached to `gulp.src()`, meaning it can be used with plugins like [**gulp-add-src**](https://github.com/urish/gulp-add-src). To be fair vinyl-filter-since can probably work with gulp-add-src as well.


## Usage

Use **gulp-filter-since** in combination with [**Gulp 3 Last Run**](https://github.com/npetruzzelli/gulp3-last-run).

```javascript
const gulp = require('gulp');
const gulp3LastRun = require('gulp3-last-run');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();
const taskLastRun = gulp3LastRun(gulp);

gulp.task('scripts', function(){
  const lastRunMs = taskLastRun.retrieveThenCapture('scripts');
  return gulp.src('app/scripts/**/*.js')
    .pipe($.filterSince(lastRunMs))
    .pipe($.babel())
    .pipe(gulp.dest('dist/scripts'))
  ;
});

gulp.task('watch', ['scripts'], function(){
  gulp.watch('app/scripts/**/*.js', ['scripts']);
});
```

## API

### gulpFilterSince(since)

Filters files by comparing the time they were last modified against the provided time.

#### since

Type: `Date` or `Number`

Setting this to a Date or a time stamp will discard any files that have not been modified since the time specified.

If this is `null` or `undefined` then no filtering will take place and all files will simply be passed through.

## TODO:

Better meet plugin guidelines:

0.  "Your plugin shouldn't do things that other plugins are responsible for"  
    _this is a grey area thanks to the similar vinyl fs plugin_
1.  Test Suite
2.  Emit errors (instead of throwing them)  
    _vinyl-fs may throw errors, but it is not bound by guidelines for plugins._
3.  prefix errors with the name of the plugin
