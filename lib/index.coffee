reactivity      = require 'reactivity'

util           = require './util'
Busy           = require './Busy'
mab            = require './memoize_and_block'
mabs           = require './memoize_and_block_scope'

###
Combinator that transforms a an async function into a pseudo-blocking service.
###
block = ( async_func, hasher = JSON.stringify ) ->
  # we ( lazily ) create a global blocked version of this function
  # this is the outmost scope and is what you end up using
  # unless you explicitly isolate the stack
  global_f = null
  resolve = ->
    if mabs.defined()
      # run this in a specific context. there is one service per context
      mabs.get async_func, hasher
    else
      # no context. use the global service
      global_f ?= mab async_func, hasher

  f = -> resolve().apply null, arguments
  f.reset = -> resolve().reset()
  f


isolate = ( blocked_service ) -> mabs.attach blocked_service

###
f = unblock f
f (err, res, monitor) -> console.log res
###
unblock = ( func ) -> ->
  [args, cb] = util.args_cb arguments
  reactivity.subscribe ( -> func.apply null, args ), (e, r, monitor, stopper) ->
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
  reactivity.subscribe func, (e, r, m, s) ->
    unless Busy.instance e
      cb e, r, m, s


# exports
x = module.exports = block
x.sync        = block
x.async       = unblock
x.busy        = blocked
x.isolate     = isolate
x.get         = get
x.subscribe   = subscribe