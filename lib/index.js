'use strict'
/**
 * Provides Gulp 4.x `since` filtering to Gulp 3.x. Since it is its own plugin,
 * it may be used with `gulp-add-src`.
 *
 * This was developed to be paired with `gulp-3-last-run` and act as an
 * implementation of the `since` option used by `gulp.src` in Gulp v4. It
 * intentionally uses the same code and dependencies that are found in
 * `vinyl-fs`.
 *
 * The `vinyl-filter-since` module does not allow for a null value, so it is not
 * suitable for the first run where there is no valid date to provide.
 *
 * @see  {@link https://github.com/gulpjs/gulp/blob/4.0/docs/API.md#optionssince}
 */

var filter = require('through2-filter')
var through = require('through2')
var valueOrFunction = require('value-or-function')

/**
 * filterSince handles logic found in `vinyl-fs/lib/filter-since.js`
 * @see {@link https://github.com/gulpjs/vinyl-fs/blob/728df8e44706aaff43eb9022cd1f80527c5cf59d/lib/filter-since.js}
 */
function filterSince(date) {
  var isValid =
    typeof date === 'number' || date instanceof Number || date instanceof Date

  if (!isValid) {
    throw new TypeError(
      'gulp-filter-since: expected `since` option to be a date or timestamp'
    )
  }
  return filter.obj(function(file) {
    return file.stat && file.stat.mtime > date
  })
}

/**
 * makeFilter handles logic found in `vinyl-fs/index.js`
 *
 * If the passed value is null or undefined, it simply passes all files through,
 * as will be the case on the first run where there will not be a value for the
 * `since` argument.
 *
 * @see {@link https://github.com/gulpjs/vinyl-fs/blob/728df8e44706aaff43eb9022cd1f80527c5cf59d/lib/src/index.js#L50-L53}
 */
function makeFilter(since) {
  since = valueOrFunction.date(since)
  if (since != null) {
    return filterSince(since)
  } else {
    return through.obj(function(file, encoding, callback) {
      this.push(file)
    })
  }
}

module.exports = makeFilter
