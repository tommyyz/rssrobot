var exports = module.exports = {}
,   _ = require('lodash');

/**
 * Returns true if the given value meets at least one of the following
 * criteria: 
 *  - undefined, null, or boolean false
 *  - an object that does not own any enumerable properties
 *  - an zero-length array
 *  - a zero-length string
 *  - the integer zero
 */
var empty = exports.empty = function(value) {
  // undefined, null, false and the integer zero are empty
  if (value === undefined || value === null || value === false || value === 0) {
    return true;
  }

  var type = typeof value;

  // a zero-length string is empty
  if (type === 'string') {
    return value.length === 0;
  }

  if (type === 'object') {

    // a zero-length array is empty
    if (typeof value.length === 'number') {
      return value.length === 0;
    }

    // an object that does not own any enumerable properties is empty
    for (var p in value) {
      if (value.hasOwnProperty(p)) {
        return false;
      }
    }

    return true;
  }

  // for everything else
  return false;
};

/**
 * Utility function that chains prototypes. The subclass constructor
 * is modified in place.
 * @param {Function} subclass
 * @param {Function} superclass
 * @param {Object} augments - optional subclass prototype augmentations
 * @return void
 */
var extend = exports.extend = function(subclass, superclass, augments) {
  var Surrogate = function() {};

  Surrogate.prototype = superclass.prototype;
  subclass.prototype = new Surrogate();
  subclass.prototype.constructor = subclass;

  _.extend(subclass.prototype, augments || {});
};

/**
 * Returns an Array representation of the supplied Object; each member
 * of the array is a two-element tuple: [key, value]. Useful for situations
 * where you need to "sort" the properties of an Object.
 * @param {Object} obj
 * @return {Array}
 */
var tuplify = exports.tuplify = function(obj) {
  var mapper = function(value, key) {return [value, key]};

  return _.map(obj, mapper);
};

var merge = exports.merge = function() {
  _.extend(arguments);
}

var noop = exports.noop = function() {}

/**
  * Poll the condition function for ttl milliseconds, and callback when the
  * condition function returns a truthy value.
  * @param {Function} condition - a function that returns a truthy or falsy value
  * @param {Function} done - invoked when the condition function returns true
  * @param {Number} ttl - number of milliseconds before polling aborts
  * @param {Number} frequency - number of milliseconds between polling iterations
  * @return void
  */
var when = exports.when = function(condition, done, ttl, frequency) {
    ttl = ttl || 1000;
    frequency = frequency || 10;

    var abort = function() {
        clear_timeouts();
        done(new Error('operation timed out'));
    };

    var abort_timeout = setTimeout(abort, ttl);

    var clear_timeouts = function() {
        clearTimeout(abort_timeout);
        clearTimeout(poll_timeout);
    };

    var poll_timeout;

    var poll = function() {
        if (condition()) {
            clear_timeouts();
            done(false);
        }
        else {
            poll_timeout = setTimeout(poll, frequency);
        }
    };

    poll();

};