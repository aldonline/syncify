
# turns an array-ish value into an Array
# for example the arguments object
arr = ( arrayish ) -> Array::slice.apply arrayish

# coffee-script friendly way of setting timeouts
delay = -> setTimeout arguments[1], arguments[0]

# concat
concat = ( arr, elm ) -> arr.concat [elm]

# default hash: JSON.stringify
hash = ( v ) -> JSON.stringify v

# extracts arguments and callback from an arguments array
args_cb = ( args ) ->
  args = arr args
  cb = args.pop( )
  unless 'function' is typeof cb
    throw new Error 'Expected a callback function as last argument'
  [args, cb]

# a slightly cleaner way of calling function.apply
# with support for async functions
apply = ( func, args, cb = undefined ) ->
  args = arr args
  args = args.concat [cb] if cb?
  func.apply null, args

# runs a sync function but returns result
# in node.js callback style
run_with_callback = ( f, cb ) ->
  try
    cb null, f()
  catch e
    cb e, null

cast_to_error = ( x ) -> if e instanceof  Error then e else new Error e

get_or_else = ( obj, key, generator ) -> if key of obj then obj[key] else ( obj[key] = generator() )

require_func = ( f ) ->
  if ( t = typeof f ) isnt 'function'
    throw new Error "requires a parameter of type 'function', not '#{t}'"

# handy func for quick tests
say_hello_delayed = ( name, cb ) -> delay 100, -> cb? null, "Hello #{name}"

log = -> console.log.apply null, arguments

EQ = (a, b) -> a is b

NOOP = ->

module.exports = {
  arr
  delay
  concat
  hash
  args_cb
  apply
  run_with_callback
  cast_to_error
  get_or_else
  require_func
  say_hello_delayed
  log
  EQ
  NOOP
}
