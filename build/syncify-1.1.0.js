;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
function isArray(xs) {
  return toString.call(xs) === '[object Array]';
}
exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
exports.indexOf = function indexOf(xs, x) {
  if (xs.indexOf) return xs.indexOf(x);
  for (var i = 0; i < xs.length; i++) {
    if (x === xs[i]) return i;
  }
  return -1;
};

// Array.prototype.filter is supported in IE9
exports.filter = function filter(xs, fn) {
  if (xs.filter) return xs.filter(fn);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (fn(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
};

// Array.prototype.forEach is supported in IE9
exports.forEach = function forEach(xs, fn, self) {
  if (xs.forEach) return xs.forEach(fn, self);
  for (var i = 0; i < xs.length; i++) {
    fn.call(self, xs[i], i, xs);
  }
};

// Array.prototype.map is supported in IE9
exports.map = function map(xs, fn) {
  if (xs.map) return xs.map(fn);
  var out = new Array(xs.length);
  for (var i = 0; i < xs.length; i++) {
    out[i] = fn(xs[i], i, xs);
  }
  return out;
};

// Array.prototype.reduce is supported in IE9
exports.reduce = function reduce(array, callback, opt_initialValue) {
  if (array.reduce) return array.reduce(callback, opt_initialValue);
  var value, isValueSet = false;

  if (2 < arguments.length) {
    value = opt_initialValue;
    isValueSet = true;
  }
  for (var i = 0, l = array.length; l > i; ++i) {
    if (array.hasOwnProperty(i)) {
      if (isValueSet) {
        value = callback(value, array[i], i, array);
      }
      else {
        value = array[i];
        isValueSet = true;
      }
    }
  }

  return value;
};

// String.prototype.substr - negative index don't work in IE8
if ('ab'.substr(-1) !== 'b') {
  exports.substr = function (str, start, length) {
    // did we get a negative start, calculate how much it is from the beginning of the string
    if (start < 0) start = str.length + start;

    // call the original function
    return str.substr(start, length);
  };
} else {
  exports.substr = function (str, start, length) {
    return str.substr(start, length);
  };
}

// String.prototype.trim is supported in IE9
exports.trim = function (str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
};

// Function.prototype.bind is supported in IE9
exports.bind = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  if (fn.bind) return fn.bind.apply(fn, args);
  var self = args.shift();
  return function () {
    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
  };
};

// Object.create is supported in IE9
function create(prototype, properties) {
  var object;
  if (prototype === null) {
    object = { '__proto__' : null };
  }
  else {
    if (typeof prototype !== 'object') {
      throw new TypeError(
        'typeof prototype[' + (typeof prototype) + '] != \'object\''
      );
    }
    var Type = function () {};
    Type.prototype = prototype;
    object = new Type();
    object.__proto__ = prototype;
  }
  if (typeof properties !== 'undefined' && Object.defineProperties) {
    Object.defineProperties(object, properties);
  }
  return object;
}
exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
function notObject(object) {
  return ((typeof object != "object" && typeof object != "function") || object === null);
}

function keysShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.keys called on a non-object");
  }

  var result = [];
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
function propertyShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
  }

  var result = keysShim(object);
  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
    result.push('length');
  }
  return result;
}

var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
  Object.getOwnPropertyNames : propertyShim;

if (new Error().hasOwnProperty('description')) {
  var ERROR_PROPERTY_FILTER = function (obj, array) {
    if (toString.call(obj) === '[object Error]') {
      array = exports.filter(array, function (name) {
        return name !== 'description' && name !== 'number' && name !== 'message';
      });
    }
    return array;
  };

  exports.keys = function (object) {
    return ERROR_PROPERTY_FILTER(object, keys(object));
  };
  exports.getOwnPropertyNames = function (object) {
    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
  };
} else {
  exports.keys = keys;
  exports.getOwnPropertyNames = getOwnPropertyNames;
}

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
function valueObject(value, key) {
  return { value: value[key] };
}

if (typeof Object.getOwnPropertyDescriptor === 'function') {
  try {
    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  } catch (e) {
    // IE8 dom element issue - use a try catch and default to valueObject
    exports.getOwnPropertyDescriptor = function (value, key) {
      try {
        return Object.getOwnPropertyDescriptor(value, key);
      } catch (e) {
        return valueObject(value, key);
      }
    };
  }
} else {
  exports.getOwnPropertyDescriptor = valueObject;
}

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util');

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!util.isNumber(n) || n < 0)
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (util.isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (util.isUndefined(handler))
    return false;

  if (util.isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (util.isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              util.isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (util.isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (util.isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!util.isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  function g() {
    this.removeListener(type, g);
    listener.apply(this, arguments);
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (util.isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (util.isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (util.isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (util.isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (util.isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};
},{"util":3}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var shims = require('_shims');

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  shims.forEach(array, function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = shims.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = shims.getOwnPropertyNames(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }

  shims.forEach(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (shims.indexOf(ctx.seen, desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = shims.reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return shims.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && objectToString(e) === '[object Error]';
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.binarySlice === 'function'
  ;
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = shims.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = shims.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"_shims":1}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Base, events, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  events = require('events');

  /*
  Base class used by Notifier and Monitor.
  It provides a basic framework to manage states.
  Implementers must implement
  @states ( a hashmap of states to handlers )
  @public_api ( with handlers )
  
  It also extends events.EventEmitter ( node.js standard )
  */


  module.exports = Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      _ref = Base.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Base.prototype.state = 'ready';

    Base.prototype.transition = function(state, f) {
      var handler;
      if (!(state in this.states)) {
        throw new Error('Invalid Transition ' + ("" + this.state + " -> " + state));
      }
      if (this.state === 'ready') {
        if (typeof f === "function") {
          f();
        }
        this.state = state;
        if (typeof (handler = this.states[state]) === 'string') {
          return typeof this[handler] === "function" ? this[handler]() : void 0;
        }
      }
    };

    return Base;

  })(events.EventEmitter);

}).call(this);

},{"events":2}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Evaluation, Monitor, Result;

  Monitor = require('./Monitor');

  Result = require('./Result');

  /*
  Internal class that wraps an evaluation
  */


  module.exports = Evaluation = (function() {
    function Evaluation(func) {
      this.func = func;
    }

    Evaluation.prototype.run = function() {
      var e, _ref, _ref1;
      try {
        return new Result({
          result: this.func(),
          monitor: (_ref = this.m) != null ? _ref.public_api : void 0
        });
      } catch (_error) {
        e = _error;
        return new Result({
          error: e,
          monitor: (_ref1 = this.m) != null ? _ref1.public_api : void 0
        });
      } finally {
        delete this.func;
        delete this.m;
      }
    };

    /*
    An evaluation owns a monitor
    */


    Evaluation.prototype.monitor = function() {
      return this.m != null ? this.m : this.m = new Monitor;
    };

    /*
    You can request N notifiers
    ( they will be provisioned by the current monitor )
    */


    Evaluation.prototype.notifier = function() {
      var _ref;
      return (_ref = this.monitor().evaluation$create_notifier()) != null ? _ref.public_api : void 0;
    };

    return Evaluation;

  })();

}).call(this);

},{"./Monitor":6,"./Result":8}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Base, Monitor, Notifier, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Notifier = require('./Notifier');

  Base = require('./Base');

  util = require('./util');

  module.exports = Monitor = (function(_super) {
    __extends(Monitor, _super);

    Monitor.prototype.states = {
      ready: null,
      changed: 'handle_change',
      cancelled: 'handle_cancel'
    };

    Monitor.prototype.cancelled_notifiers = 0;

    function Monitor() {
      this.user$cancel = __bind(this.user$cancel, this);
      this.notifier$cancel_notifier = __bind(this.notifier$cancel_notifier, this);
      this.evaluation$create_notifier = __bind(this.evaluation$create_notifier, this);
      var f,
        _this = this;
      this.notifiers = [];
      this.public_api = f = function(h) {
        return _this.once('change', h);
      };
      util.copy_event_emitter_methods(this, f);
      f.cancel = function() {
        return _this.user$cancel();
      };
      f.state = function() {
        return _this.state;
      };
    }

    Monitor.prototype.handle_cancel = function() {
      this.emit('cancel');
      return this.emit('destroy');
    };

    Monitor.prototype.handle_change = function() {
      this.emit('change');
      return this.emit('destroy');
    };

    Monitor.prototype.evaluation$create_notifier = function() {
      var n;
      this.notifiers.push(n = new Notifier(this));
      return n;
    };

    Monitor.prototype.notifier$cancel_notifier = function() {
      if (this.notifiers.length === ++this.cancelled_notifiers) {
        return this.transition('cancelled');
      }
    };

    Monitor.prototype.notifier$change = function() {
      var _this = this;
      return this.transition('changed', function() {
        var x, _i, _len, _ref, _results;
        _ref = _this.notifiers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (x.state === 'ready') {
            _results.push(x.monitor$cancel());
          }
        }
        return _results;
      });
    };

    Monitor.prototype.user$cancel = function() {
      var _this = this;
      return this.transition('cancelled', function() {
        var x, _i, _len, _ref, _results;
        _ref = _this.notifiers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (x.state === 'ready') {
            _results.push(x.monitor$cancel());
          }
        }
        return _results;
      });
    };

    return Monitor;

  })(Base);

}).call(this);

},{"./Base":4,"./Notifier":7,"./util":14}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Base, Notifier, util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('./Base');

  util = require('./util');

  /*
  The Notifier is the main class used when creating reactive functions
  */


  module.exports = Notifier = (function(_super) {
    __extends(Notifier, _super);

    Notifier.prototype.states = {
      ready: null,
      cancelled: 'handle_cancel',
      changed: 'handle_change'
    };

    function Notifier(monitor) {
      var f,
        _this = this;
      this.monitor = monitor;
      this.user$cancel = __bind(this.user$cancel, this);
      this.user$change = __bind(this.user$change, this);
      this.public_api = f = function() {
        return _this.user$change();
      };
      util.copy_event_emitter_methods(this, f);
      f.state = function() {
        return _this.state;
      };
      f.cancel = this.user$cancel;
      f.change = this.user$change;
    }

    Notifier.prototype.handle_cancel = function() {
      this.emit('cancel');
      return this.emit('destroy');
    };

    Notifier.prototype.handle_change = function() {
      this.emit('change');
      return this.emit('destroy');
    };

    Notifier.prototype.user$change = function() {
      var _this = this;
      return this.transition('changed', function() {
        return _this.monitor.notifier$change();
      });
    };

    Notifier.prototype.user$cancel = function() {
      var _this = this;
      return this.transition('cancelled', function() {
        return _this.monitor.notifier$cancel_notifier();
      });
    };

    Notifier.prototype.monitor$cancel = function() {
      return this.transition('cancelled');
    };

    return Notifier;

  })(Base);

}).call(this);

},{"./Base":4,"./util":14}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Result;

  module.exports = Result = (function() {
    function Result(_arg) {
      this.error = _arg.error, this.result = _arg.result, this.monitor = _arg.monitor;
    }

    return Result;

  })();

}).call(this);

},{}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Box;

  Box = (function() {
    function Box() {}

    Box.prototype.do_get = function() {
      if (this.is_error) {
        throw this.v;
      } else {
        return this.v;
      }
    };

    Box.prototype.do_set = function(e, r) {
      var is_error, new_v;
      new_v = (is_error = e != null) ? e : r;
      if (new_v === this.v) {
        return false;
      }
      this.is_error = is_error;
      this.v = new_v;
      return true;
    };

    Box.prototype.do_set_auto = function() {
      var a;
      a = arguments;
      if (a.length === 2) {
        return this.do_set.apply(this, a);
      }
      if (a[0] instanceof Error) {
        return this.do_set(a[0], null);
      } else {
        return this.do_set(null, a[0]);
      }
    };

    return Box;

  })();

  module.exports = function(_arg) {
    var active, cell, notifier;
    notifier = _arg.notifier, active = _arg.active;
    return cell = function() {
      var box, f, notifiers;
      box = new Box;
      notifiers = void 0;
      f = function() {
        var a, cb, notifiers_, _i, _len;
        a = arguments;
        if (a.length === 0) {
          if (active()) {
            (notifiers != null ? notifiers : notifiers = []).push(notifier());
          }
          return box.do_get();
        }
        if (box.do_set_auto.apply(box, a)) {
          if ((notifiers_ = notifiers) != null) {
            notifiers = void 0;
            for (_i = 0, _len = notifiers_.length; _i < _len; _i++) {
              cb = notifiers_[_i];
              cb();
            }
          }
        }
        return void 0;
      };
      return f;
    };
  };

}).call(this);

},{}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Evaluation;

  Evaluation = require('./Evaluation');

  module.exports = function() {
    var active, notifier, run, stack;
    stack = [];
    /*
    Runs a reactive function and returns a Result object
    */

    run = function(f) {
      var ev;
      try {
        stack.push(ev = new Evaluation(f));
        return ev.run();
      } finally {
        stack.pop();
      }
    };
    notifier = function() {
      var _ref;
      return (_ref = stack[stack.length - 1]) != null ? _ref.notifier() : void 0;
    };
    active = function() {
      return stack.length !== 0;
    };
    return {
      notifier: notifier,
      active: active,
      run: run
    };
  };

}).call(this);

},{"./Evaluation":5}],11:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};// Generated by CoffeeScript 1.6.3
(function() {
  var GLOBAL, build, conditional_build, core, util, version, _cell, _poll, _subscribe;

  core = require('./core');

  _poll = require('./poll');

  _subscribe = require('./subscribe');

  version = require('./version');

  util = require('./util');

  _cell = require('./cell');

  /*
  Main entry point to the reactivity framework.
  Exports an object that exposes the 5 API methods.
  The object is itself an overloaded function that proxies
  to the methods for convenience.
  */


  build = function() {
    var active, cell, main, notifier, poll, run, subscribe, _c, _ref;
    _ref = _c = core(), notifier = _ref.notifier, active = _ref.active, run = _ref.run;
    subscribe = _subscribe(_c);
    poll = _poll(_c);
    cell = _cell(_c);
    main = function() {
      var c;
      c = cell();
      if (arguments.length === 1) {
        c(arguments[0]);
      }
      return c;
    };
    main.notifier = notifier;
    main.active = active;
    main.run = run;
    main.subscribe = subscribe;
    main.poll = poll;
    main.cell = cell;
    main.version = version;
    return main;
  };

  GLOBAL = global || window;

  (conditional_build = function() {
    var create, other, other_version;
    create = false;
    if ((other = GLOBAL.reactivity) != null) {
      other_version = other.version || '0.0.0';
      if (util.compare_semver(version, other_version) === 'GT') {
        create = true;
      }
    } else {
      create = true;
    }
    if (create) {
      return GLOBAL.reactivity = build();
    }
  })();

  module.exports = GLOBAL.reactivity;

}).call(this);

},{"./cell":9,"./core":10,"./poll":12,"./subscribe":13,"./util":14,"./version":15}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(_arg) {
    var EQ, active, build_compare, delay, notifier, poll, run;
    notifier = _arg.notifier, active = _arg.active, run = _arg.run;
    EQ = function(a, b) {
      return a === b;
    };
    delay = function() {
      return setTimeout(arguments[1], arguments[0]);
    };
    build_compare = function(eq) {
      return function(out1, out2) {
        return eq(out1.result, out2.result) && eq(out1.error, out2.error);
      };
    };
    poll = function(f, interval, eq) {
      var compare, run_;
      if (interval == null) {
        interval = 100;
      }
      if (eq == null) {
        eq = EQ;
      }
      run_ = function() {
        return (function(args) {
          return run(function() {
            return f.apply(null, args);
          });
        })(arguments);
      };
      compare = build_compare(eq);
      return function() {
        var b, error, iter, monitor, out, result, stopped, _ref;
        if (active()) {
          _ref = out = run_(), result = _ref.result, error = _ref.error, monitor = _ref.monitor;
          if (monitor != null) {
            monitor.once('change', notifier());
          } else {
            b = notifier();
            stopped = false;
            b.once('cancel', function() {
              return stopped = true;
            });
            (iter = function() {
              if (!stopped) {
                return delay(interval, function() {
                  if (!stopped) {
                    if (compare(out, run_())) {
                      return iter();
                    } else {
                      return b();
                    }
                  }
                });
              }
            })();
          }
          if (out.error != null) {
            throw out.error;
          }
          return out.result;
        } else {
          return f();
        }
      };
    };
    return poll;
  };

}).call(this);

},{}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = function(_arg) {
    var active, notifier, run;
    notifier = _arg.notifier, active = _arg.active, run = _arg.run;
    return function(func, cb) {
      var iter, mon, stopped, stopper;
      mon = null;
      stopped = false;
      stopper = function() {
        stopped = true;
        return mon != null ? mon.removeListener('change', iter) : void 0;
      };
      (iter = function() {
        var r;
        if (!stopped) {
          r = run(func);
          if (typeof cb === "function") {
            cb(r.error, r.result, r.monitor, stopper);
          }
          mon = r.monitor;
          return mon != null ? mon.once('change', iter) : void 0;
        }
      })();
      stopper.stop = stopper;
      return stopper;
    };
  };

}).call(this);

},{}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var ee;

  ee = 'addListener on once removeListener removeAllListeners setMaxListeners listeners'.split(' ');

  module.exports = {
    copy_event_emitter_methods: function(source, target) {
      var n, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = ee.length; _i < _len; _i++) {
        n = ee[_i];
        _results.push((function(n) {
          return target[n] = function() {
            return source[n].apply(source, arguments);
          };
        })(n));
      }
      return _results;
    },
    compare_semver: function(v1, v2) {
      var arr, i, x, x1, x2, _i, _len;
      v1 = (function() {
        var _i, _len, _ref, _results;
        _ref = v1.split('.');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(Number(x));
        }
        return _results;
      })();
      v2 = (function() {
        var _i, _len, _ref, _results;
        _ref = v2.split('.');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          _results.push(Number(x));
        }
        return _results;
      })();
      arr = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = v1.length; _i < _len; i = ++_i) {
          x1 = v1[i];
          x2 = v2[i];
          if (x1 > x2) {
            _results.push('GT');
          } else if (x1 < x2) {
            _results.push('LT');
          } else {
            _results.push('EQ');
          }
        }
        return _results;
      })();
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        x = arr[_i];
        if (x === 'GT') {
          return 'GT';
        } else if (x === 'LT') {
          return 'LT';
        }
      }
      return 'EQ';
    }
  };

}).call(this);

},{}],15:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  module.exports = '2.0.2';

}).call(this);

},{}],16:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
/*
Map[Any,Any]
*/


(function() {
  var refmap;

  module.exports = refmap = function() {
    var arr, clear, del, entry, exists, f, get, get_or_else, keys, set, size, values;
    arr = [];
    entry = function(k) {
      var x, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        x = arr[_i];
        if (x[0] === k) {
          return x;
        }
      }
      return void 0;
    };
    get = function(k) {
      var _ref;
      return (_ref = entry(k)) != null ? _ref[1] : void 0;
    };
    exists = function(k) {
      return entry(k) instanceof Array;
    };
    del = function(k) {
      var kv;
      if (exists(k)) {
        arr = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            kv = arr[_i];
            if (kv[0] !== k) {
              _results.push(kv);
            }
          }
          return _results;
        })();
        return true;
      } else {
        return false;
      }
    };
    set = function(k, v) {
      var e;
      if ((e = entry(k)) != null) {
        if (e[1] === v) {
          return false;
        }
        e[1] = v;
      } else {
        arr.push([k, v]);
      }
      return true;
    };
    keys = function() {
      var kv, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        kv = arr[_i];
        _results.push(kv[0]);
      }
      return _results;
    };
    values = function() {
      var kv, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        kv = arr[_i];
        _results.push(kv[1]);
      }
      return _results;
    };
    clear = function() {
      return arr = [];
    };
    size = function() {
      return arr.length;
    };
    get_or_else = function(k, block) {
      var e, v;
      if ((e = entry(k)) != null) {
        return e[1];
      } else {
        arr.push([k, (v = block())]);
        return v;
      }
    };
    f = function() {
      var a;
      a = arguments;
      switch (a.length) {
        case 1:
          return get(a[0]);
        case 2:
          return set(a[0], a[1]);
        default:
          throw new Error('refmap takes 1 or 2 parameters');
      }
    };
    f.get = get;
    f.set = set;
    f.exists = exists;
    f.del = del;
    f.get_or_else = get_or_else;
    f.keys = keys;
    f.values = values;
    f.clear = clear;
    f.size = size;
    return f;
  };

}).call(this);

},{}],17:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var StackVal,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  StackVal = (function() {
    function StackVal() {
      this.defined = __bind(this.defined, this);
      this.get = __bind(this.get, this);
      this.attach = __bind(this.attach, this);
      this._stack = [];
    }

    /*
    Combinator that returns a function with an attached stack value.
    Whenever you execute this function  the generator function will be executed
    and the resulting value will will be accessible to any downstack function.
    */


    StackVal.prototype.attach = function(f, generator) {
      var sv;
      if (typeof f !== 'function') {
        throw new Error('function argument required');
      }
      sv = this;
      return function() {
        try {
          sv._stack.push(generator());
          return f.apply(this, arguments);
        } finally {
          sv._stack.pop();
        }
      };
    };

    /*
    Gets a stackval that was attached to an upstack function
    will throw an error if there is no upstack function with a value
    attached
    */


    StackVal.prototype.get = function() {
      if (this.defined()) {
        return this._stack[this._stack.length - 1];
      } else {
        throw new Error('No stackval found upstack');
      }
    };

    /*
    true if there is a value attached upstack
    */


    StackVal.prototype.defined = function() {
      return this._stack.length !== 0;
    };

    return StackVal;

  })();

  module.exports = function() {
    var main, s;
    s = new StackVal();
    main = function() {
      var a;
      a = arguments;
      if (a.length === 2) {
        return s.attach(a[0], a[1]);
      } else {
        return s.get();
      }
    };
    main.attach = function() {
      return s.attach.apply(s, arguments);
    };
    main.get = function() {
      return s.get.apply(s, arguments);
    };
    main.defined = function() {
      return s.defined.apply(s, arguments);
    };
    return main;
  };

}).call(this);

},{}],18:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Busy, KEY,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  KEY = '___SOME_PATIENCE_PLEASE___';

  module.exports = Busy = (function(_super) {
    __extends(Busy, _super);

    function Busy() {
      this[KEY] = true;
    }

    Busy.prototype.toString = function() {
      return 'Busy';
    };

    Busy.instance = function(i) {
      return i instanceof Error && i[KEY] === true;
    };

    return Busy;

  })(Error);

}).call(this);

},{}],19:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Busy, Executor, MonitorCollector, ParallelExecutor, RootExecutor, SequenceExecutor, current, join_monitors, parallel, reactivity, sequence, util, with_executor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  util = require('./util');

  Busy = require('./Busy');

  reactivity = require('reactivity');

  MonitorCollector = (function() {
    function MonitorCollector() {
      this.ms = [];
    }

    MonitorCollector.prototype.push = function(m) {
      if (m != null) {
        return this.ms.push(m);
      }
    };

    MonitorCollector.prototype.join = function() {
      return join_monitors(this.ms);
    };

    MonitorCollector.prototype.empty = function() {
      return this.ms.length === 0;
    };

    MonitorCollector.prototype.reset = function() {
      return this.ms = [];
    };

    return MonitorCollector;

  })();

  join_monitors = function(monitors) {
    var cb, fired, m, notifier, _i, _len, _results;
    if (reactivity.active() && monitors.length > 0) {
      notifier = reactivity.notifier();
      fired = false;
      cb = function() {
        var m, pending_monitors;
        if (!fired) {
          pending_monitors = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = monitors.length; _i < _len; _i++) {
              m = monitors[_i];
              if (m.state() === 'ready') {
                _results.push(m);
              }
            }
            return _results;
          })();
          if (pending_monitors.length === 0) {
            fired = true;
            return notifier.change();
          }
        }
      };
      _results = [];
      for (_i = 0, _len = monitors.length; _i < _len; _i++) {
        m = monitors[_i];
        _results.push(m.once('change', cb));
      }
      return _results;
    }
  };

  Executor = (function() {
    function Executor() {}

    Executor.prototype.run = function(f) {
      var _this = this;
      return this.parent._run_child(function() {
        return _this._run(f);
      });
    };

    Executor.prototype._run = function(f) {
      return f();
    };

    Executor.prototype._run_child = function(f) {
      return f();
    };

    return Executor;

  })();

  RootExecutor = (function(_super) {
    __extends(RootExecutor, _super);

    function RootExecutor() {
      _ref = RootExecutor.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RootExecutor.prototype.run = function(f) {
      return f();
    };

    return RootExecutor;

  })(Executor);

  SequenceExecutor = (function(_super) {
    __extends(SequenceExecutor, _super);

    function SequenceExecutor(parent) {
      this.parent = parent;
    }

    return SequenceExecutor;

  })(Executor);

  ParallelExecutor = (function(_super) {
    __extends(ParallelExecutor, _super);

    function ParallelExecutor(parent) {
      this.parent = parent;
      this.monitors = new MonitorCollector();
      this.pending_count = 0;
    }

    ParallelExecutor.prototype._run = function(f) {
      var res;
      res = reactivity.run(f);
      this.monitors.push(res.monitor);
      this.monitors.join();
      if (this.pending_count > 0) {
        throw new Busy();
      }
      if (res.error != null) {
        throw res.error;
      }
      return res.result;
    };

    ParallelExecutor.prototype._run_child = function(f) {
      var res;
      res = reactivity.run(f);
      this.monitors.push(res.monitor);
      if (res.error == null) {
        return res.result;
      }
      if (Busy.instance(res.error)) {
        return this.pending_count++;
      } else {
        throw res.error;
      }
    };

    return ParallelExecutor;

  })(Executor);

  current = new RootExecutor;

  with_executor = function(Ex) {
    return function(f) {
      return util.around({
        before: function() {
          return current = new Ex(current);
        },
        "finally": function() {
          return current = current.parent;
        },
        func: function() {
          var args;
          args = arguments;
          return current.run(function() {
            return f.apply(null, args);
          });
        }
      });
    };
  };

  module.exports = {
    sequence: sequence = with_executor(SequenceExecutor),
    parallel: parallel = with_executor(ParallelExecutor)
  };

}).call(this);

},{"./Busy":18,"./util":24,"reactivity":11}],20:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Busy, executors, get, mab, mabs, main, pending, reactivity, revert, subscribe, syncify, syncify_global, syncify_local, util, x;

  reactivity = require('reactivity');

  util = require('./util');

  Busy = require('./Busy');

  mab = require('./memoize_and_block');

  mabs = require('./memoize_and_block_scope');

  executors = require('./executors');

  /*
  options =
    global: no
    hasher: JSON.stringify
  */


  syncify = function(async_func, opts) {
    var global, hasher;
    if (opts == null) {
      opts = void 0;
    }
    global = (opts != null ? opts.global : void 0) === true;
    hasher = (opts != null ? opts.hasher : void 0) || JSON.stringify;
    if (global) {
      return syncify_global(async_func, hasher);
    } else {
      return syncify_local(async_func, hasher);
    }
  };

  syncify_local = function(async_func, hasher) {
    return function() {
      var func;
      if (mabs.defined()) {
        func = mabs.get_or_create(async_func, hasher);
        return func.apply(null, arguments);
      } else {
        throw new Error('local syncified function with no parent context');
      }
    };
  };

  syncify_global = function(async_func, hasher) {
    return mab(async_func, hasher);
  };

  /*
  f = revert f
  f (err, res, monitor) -> console.log res
  */


  revert = function(func) {
    func = executors.sequence(func);
    return function() {
      var args, cb, _ref;
      _ref = util.args_cb(arguments), args = _ref[0], cb = _ref[1];
      func = mabs.attach(func);
      reactivity.subscribe((function() {
        return func.apply(null, args);
      }), function(e, r, monitor, stopper) {
        if (!Busy.instance(e)) {
          stopper();
          return typeof cb === "function" ? cb(e, r, monitor) : void 0;
        }
      });
      return void 0;
    };
  };

  /*
  tests to see whether a function is blocked ( working )
  */


  pending = function(f) {
    var e;
    try {
      f();
      return false;
    } catch (_error) {
      e = _error;
      if (Busy.instance(e)) {
        return true;
      } else {
        throw e;
      }
    }
  };

  get = function(f, v) {
    var result;
    result = void 0;
    if (pending(function() {
      return result = f();
    })) {
      if (typeof v === 'function') {
        return v();
      } else {
        return v;
      }
    } else {
      return result;
    }
  };

  subscribe = function(func, cb) {
    var iter, stopped, stopper;
    stopped = false;
    stopper = function() {
      return stopped = true;
    };
    (iter = function() {
      if (!stopped) {
        return revert(func)(function(e, r, m) {
          if (!stopped) {
            if (m != null) {
              m.on('change', iter);
            }
            return typeof cb === "function" ? cb(e, r, m, stopper) : void 0;
          }
        });
      }
    })();
    return stopper;
  };

  main = function(x, y) {
    var args, cb, func;
    if (arguments.length === 3) {
      func = arguments[0], args = arguments[1], cb = arguments[2];
      args.push(cb);
      return revert(func).apply(null, args);
    } else {
      switch (typeof x + ' ' + typeof y) {
        case 'function undefined':
          return syncify(x);
        case 'function function':
          return subscribe(x, y);
        case 'object function':
          return syncify(y, x);
        case 'function object':
          return syncify(x, y);
        default:
          throw new Error('Invalid Arguments');
      }
    }
  };

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = main;
  }

  x = main;

  x.revert = revert;

  x.pending = pending;

  x.get = get;

  x.subscribe = subscribe;

  x.parallel = function(f) {
    return executors.parallel(f)();
  };

  x.sequence = function(f) {
    return executors.sequence(f)();
  };

  if (typeof window !== "undefined" && window !== null) {
    window.syncify = main;
  }

}).call(this);

},{"./Busy":18,"./executors":19,"./memoize_and_block":21,"./memoize_and_block_scope":22,"./util":24,"reactivity":11}],21:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var Busy, executors, reactivity, util,
    __hasProp = {}.hasOwnProperty;

  util = require('./util');

  Busy = require('./Busy');

  reactivity = require('reactivity');

  executors = require('./executors');

  /*
  
  Returns a function that has an internal cache.
  
  
  @async_func an async function ( that takes a node-style callback )
  @hasher an optional function that must return a string
          it will receive a set of arguments as input
  */


  module.exports = function(async_func, hasher) {
    var blocked_f, cache;
    if (hasher == null) {
      hasher = JSON.stringify;
    }
    cache = {};
    blocked_f = executors.sequence(function() {
      var args, _name;
      args = util.arr(arguments);
      return (cache[_name = hasher(args)] != null ? cache[_name = hasher(args)] : cache[_name] = (function() {
        var c;
        c = reactivity(new Busy);
        util.apply(async_func, args, function(e, r) {
          if (e != null) {
            return c(e);
          } else {
            return c(r);
          }
        });
        return c;
      })())();
    });
    blocked_f.reset = function() {
      var cell, k, old_cache, _results;
      old_cache = cache;
      cache = {};
      _results = [];
      for (k in old_cache) {
        if (!__hasProp.call(old_cache, k)) continue;
        cell = old_cache[k];
        _results.push(cell({}));
      }
      return _results;
    };
    return blocked_f;
  };

}).call(this);

},{"./Busy":18,"./executors":19,"./util":24,"reactivity":11}],22:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var mab, sr, stack_refmap;

  stack_refmap = require('./stack_refmap');

  mab = require('./memoize_and_block');

  sr = stack_refmap();

  module.exports = {
    attach: function(func) {
      return sr.attach(func);
    },
    get_or_create: function(async_func, hasher) {
      if (hasher == null) {
        hasher = JSON.stringify;
      }
      return sr.get_or_else(async_func, function() {
        return mab(async_func, hasher);
      });
    },
    defined: function() {
      return sr.defined();
    }
  };

}).call(this);

},{"./memoize_and_block":21,"./stack_refmap":23}],23:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var StackRefmap, refmap, stackval,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  refmap = require('refmap');

  stackval = require('stackval');

  /*
  Attaches a reference map to the stack
  TODO: inherit
  */


  StackRefmap = (function() {
    function StackRefmap() {
      this.get_or_else = __bind(this.get_or_else, this);
      this.get = __bind(this.get, this);
      this.attach = __bind(this.attach, this);
      this.sv = stackval();
    }

    StackRefmap.prototype.attach = function(f) {
      var m;
      m = refmap();
      return this.sv.attach(f, function() {
        return m;
      });
    };

    StackRefmap.prototype.get = function(key) {
      return this.sv.get().get(key);
    };

    StackRefmap.prototype.get_or_else = function(key, generator) {
      return this.sv.get().get_or_else(key, generator);
    };

    StackRefmap.prototype.defined = function() {
      return this.sv.defined();
    };

    return StackRefmap;

  })();

  module.exports = function() {
    return new StackRefmap;
  };

}).call(this);

},{"refmap":16,"stackval":17}],24:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
(function() {
  var EQ, NOOP, apply, args_cb, around, arr, cast_to_error, concat, delay, get_or_else, hash, log, require_func, run_with_callback, say_hello_delayed;

  arr = function(arrayish) {
    return Array.prototype.slice.apply(arrayish);
  };

  delay = function() {
    return setTimeout(arguments[1], arguments[0]);
  };

  concat = function(arr, elm) {
    return arr.concat([elm]);
  };

  hash = function(v) {
    return JSON.stringify(v);
  };

  args_cb = function(args) {
    var cb;
    args = arr(args);
    cb = args.pop();
    if ('function' !== typeof cb) {
      throw new Error('Expected a callback function as last argument');
    }
    return [args, cb];
  };

  apply = function(func, args, cb) {
    if (cb == null) {
      cb = void 0;
    }
    args = arr(args);
    if (cb != null) {
      args = args.concat([cb]);
    }
    return func.apply(null, args);
  };

  run_with_callback = function(f, cb) {
    var e;
    try {
      return cb(null, f());
    } catch (_error) {
      e = _error;
      return cb(e, null);
    }
  };

  cast_to_error = function(x) {
    if (e instanceof Error) {
      return e;
    } else {
      return new Error(e);
    }
  };

  get_or_else = function(obj, key, generator) {
    if (key in obj) {
      return obj[key];
    } else {
      return obj[key] = generator();
    }
  };

  require_func = function(f) {
    var t;
    if ((t = typeof f) !== 'function') {
      throw new Error("requires a parameter of type 'function', not '" + t + "'");
    }
  };

  say_hello_delayed = function(name, cb) {
    return delay(100, function() {
      return typeof cb === "function" ? cb(null, "Hello " + name) : void 0;
    });
  };

  log = function() {
    return console.log.apply(null, arguments);
  };

  EQ = function(a, b) {
    return a === b;
  };

  NOOP = function() {};

  around = function(opts) {
    return function() {
      if (typeof opts.before === "function") {
        opts.before();
      }
      try {
        return opts.func.apply(null, arguments);
      } finally {
        if (typeof opts["finally"] === "function") {
          opts["finally"]();
        }
      }
    };
  };

  module.exports = {
    arr: arr,
    delay: delay,
    concat: concat,
    hash: hash,
    args_cb: args_cb,
    apply: apply,
    run_with_callback: run_with_callback,
    cast_to_error: cast_to_error,
    get_or_else: get_or_else,
    require_func: require_func,
    say_hello_delayed: say_hello_delayed,
    log: log,
    EQ: EQ,
    NOOP: NOOP,
    around: around
  };

}).call(this);

},{}]},{},[20])
;