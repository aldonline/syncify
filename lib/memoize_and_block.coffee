rcell      = require 'reactive-cell'
util      = require './util'
Blocking  = require './Blocking'

###
GC Warning:
The memoized version of the function will store results indefinitely
in its internal cache.
This won't be problem if you're scoping function instances properly
and let the native GC take care of disposing it.

You can call F.reset() to clear the cache.

@async_func an async function ( that takes a node-style callback )
@hasher an optional function that must return a string
        it will receive a set of arguments as input
###
module.exports = ( async_func, hasher = JSON.stringify ) ->
  cache = {}
  blocked_f = ->
    args = util.arr arguments
    do cache[ hasher args ] ?= do ->
      # create a new cell for each hash
      # ( which should represent a distinct combination of arguments )
      c = rcell()
      # and set it to a Blocking error in the meantime
      # to signal any caller that we are busy working
      c new Blocking
      # lets call the async function and set cell value when it arrives
      util.apply async_func, args, c.callback
      c

  # delete the cache
  blocked_f.reset = -> cache = {}
  blocked_f