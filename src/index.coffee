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
  if global
    block_global async_func, hasher
  else
    block_local async_func, hasher

block_local = ( async_func, hasher ) ->
  ->
    # we look for a local scope up the stack
    if mabs.defined()
      func = mabs.get_or_create async_func, hasher
      func.apply null, arguments
    else
      throw new Error 'local syncified function with no parent context'

block_global = ( async_func, hasher ) -> mab async_func, hasher

###
f = unblock f
f (err, res, monitor) -> console.log res
###
unblock = ( func ) -> ->
  [args, cb] = util.args_cb arguments
  func = mabs.attach func
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
  stopped = no
  stopper = -> stopped = yes
  do iter = ->
    unless stopped
      unblock(func) (e, r, m) ->
        unless stopped      
          m?.on 'change', iter
          cb? e, r, m, stopper
  stopper

# overloaded main
main = ( x, y ) ->
  # syncify syncified_func, arguments, callback
  # this is a very common usecase
  if arguments.length is 3
    [func, args, cb] = arguments
    args.push cb
    unblock( func ).apply null, args
  else
    switch typeof x + ' ' + typeof y
      when 'function undefined'  then block x
      when 'function function'   then subscribe x, y
      when 'object function'     then block y, x
      when 'function object'     then block x, y
      else throw new Error 'Invalid Arguments'


# Common.js exports
if module? and module.exports?
  x = module.exports = main
  x.sync        = block
  x.async       = unblock
  x.revert      = unblock
  x.busy        = blocked
  x.get         = get
  x.subscribe   = subscribe

# Browser exports
if window?
  window.syncify = main


