reactivity      = require 'reactivity'

util           = require './util'
Blocking       = require './Blocking'
mab            = require './memoize_and_block'
mabs           = require './memoize_and_block_scope'

###
Combinator
###
block = ( async_func, hasher = JSON.stringify ) ->
  # we ( lazily ) create a global blocked version of this function
  # this is the outmost scope
  global_mab_f = null
  gm = ->
    # initialize global blocked version
    global_mab_f ?= mab async_func, hasher
    global_mab_f
  ->
    if mabs.defined()
      # run this in a specific context
      # there is one blocked version of this function
      # per context
      ( mabs.get async_func, hasher ).apply null, arguments
    else
      # no context. use the global function
      gm().apply null, arguments

unblock = ( func ) ->
  # we attach the scope to an outer function
  # in case the passed in function throws a Blocking error itself
  # otherwise there would be no way to store the memoized version
  f = mabs.attach -> func.apply null, arguments
  ->
    [args, cb] = util.args_cb arguments
    reactivity.subscribe ( -> f.apply null, args ), (e, r, m) ->
      unless Blocking.instance e
        m.destroy()
        cb? e, r, m

###
tests to see whether a function is blocked ( working )
###
blocked = ( f ) ->
  try
    f()
    false
  catch e
    if Blocking.instance e
      true
    else
      throw e

# gets the result of executing F.
# if F is blocked it will then return V
# ( if V is a function it will execute V )
# could be called get_or_else() but its too long
get = ( f, v ) ->
  result = undefined
  if ( blocked -> result = f() )
    if typeof v is 'function' then v() else v
  else
    result

# exports
x = module.exports = block
x.block       = block
x.unblock     = unblock
x.blocked     = blocked
x.get         = get