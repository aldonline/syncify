rc             = require 'reactive-commons'

util           = require './util'
Blocking       = require './Blocking'
mabs           = require './memoize_and_block_scope'

assert_func = ( f ) ->
  unless typeof f is 'function'
    throw new Error 'function required'

block = ( async_func ) -> ->
  # get the MABed function from the scope
  ( mabs.get async_func ).apply null, arguments

unblock = ( func ) ->
  assert_func func
  func = mabs.attach func
  assert_func func
  ->
    [args, cb] = util.args_cb arguments
    assert_func cb
    rc.stream ( -> func.apply null, args ), (e, r, n, stop) ->
      unless Blocking.instance e
        assert_func stop
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