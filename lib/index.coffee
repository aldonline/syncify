rc             = require 'reactive-commons'

util           = require './util'
Blocking       = require './Blocking'
mabs           = require './memoize_and_block_scope'

block = ( async_func ) -> ->
  # get the MABed function from the scope
  ( mabs.get async_func ).apply null, arguments

unblock = ( func ) ->
  # we attach the scope to an outer function
  # in case the passed in function throws a Blocking error itself
  # otherwise there would be no way to store the memoized version
  f = mabs.attach -> func.apply null, arguments
  ->
    [args, cb] = util.args_cb arguments
    rc.stream ( -> f.apply null, args ), (e, r, n, stop) ->
      unless Blocking.instance e
        stop()
        cb? e, r, n

blocked = ( f ) ->
  try
    f()
    false
  catch e
    if Blocking.instance e
      true
    else
      throw e

# exports
x = module.exports = block
x.block       = block
x.unblock     = unblock
x.blocked     = blocked
x.Blocking    = Blocking