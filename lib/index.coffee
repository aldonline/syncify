reactivity      = require 'reactivity'

util           = require './util'
Busy           = require './Busy'
mab            = require './memoize_and_block'
mabs           = require './memoize_and_block_scope'


###
options =
  global: no
  hasher: JSON.stringify
###
block = ( async_func, opts = undefined ) ->
  global  = opts?.global is true
  hasher  = ( opts?.hasher or JSON.stringify )

  global_f = null
  resolve = ->
    if global
      global_f ?= mab async_func, hasher
    else if mabs.defined()
      # run this in a specific context. there is one service per context
      mabs.get async_func, hasher
    else
      throw new Error 'no context'
  f = -> resolve().apply null, arguments
  f.reset = -> resolve().reset()
  f

# isolate = ( blocked_service ) -> mabs.attach blocked_service

###
f = unblock f
f (err, res, monitor) -> console.log res
###
unblock = ( func ) -> ->
  [args, cb] = util.args_cb arguments
  func = mabs.attach func
  reactivity ( -> func.apply null, args ), (e, r, monitor, stopper) ->
    unless Busy.instance e
      stopper()
      cb? e, r, monitor
  undefined

###
tests to see whether a function is blocked ( working )
###
blocked = ( f ) ->
  try
    f()
    false
  catch e
    if Busy.instance e
      true
    else
      throw e

# gets the result of executing F.
# if F is blocked it will then return V
# ( if V is a function it will execute V )
# could be called get_or_else() but that's too long
get = ( f, v ) ->
  result = undefined
  if ( blocked -> result = f() )
    if typeof v is 'function' then v() else v
  else
    result


subscribe = ( func, cb ) ->
  reactivity mabs.attach(func), (e, r, m, s) ->
    unless Busy.instance e
      cb e, r, m, s


# overloaded main
main = ( x, y ) ->
  switch typeof x + ' ' + typeof y
    when 'function undefined'  then block x
    when 'function function'   then subscribe x, y
    when 'object function'     then block y, x
    when 'function object'     then block x, y
    else throw new Error 'Invalid Arguments'


# exports
x = module.exports = main
x.sync        = block
x.async       = unblock
x.busy        = blocked
x.get         = get
x.subscribe   = subscribe