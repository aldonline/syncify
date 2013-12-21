util       = require './util'
Busy       = require './Busy'
reactivity = require 'reactivity'

###

Returns a function that has an internal cache.


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
      # and set it to a Busy error in the meantime
      # to signal any caller that we are busy working
      c = reactivity new Busy

      # lets call the async function and set cell value when it arrives
      util.apply async_func, args, (e, r) -> if e? then c e else c r
      c
  blocked_f.reset = ->
    old_cache = cache
    cache = {} # empty cache ( next time a request is made it will be forced to fetch the result once again )
    for own k, cell of old_cache
      cell cell() + '.' # change value to force an invalidation

  blocked_f