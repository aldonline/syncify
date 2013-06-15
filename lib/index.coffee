rc             = require 'reactive-commons'

util           = require './util'
Blocking       = require './Blocking'
mabs           = require './memoize_and_block_scope'

block = ( async_func ) -> ->
  # get the MABed function from the scope
  ( mabs.get async_func ).apply null, arguments

unblock = ( func ) ->
  func = mabs.attach func
  ->
    [args, cb] = util.args_cb arguments
    rc.stream ( -> func.apply null, args ), (e, r, n, stop) ->
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