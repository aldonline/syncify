cell      = require 'radioactive-cell'
util      = require './util'
Blocking  = require './Blocking'

###
GC Warning: this memoized version will store results indefinitely
###
module.exports = ( f, hasher = JSON.stringify ) ->
  cache = {}
  ->
    args = util.arr arguments
    hash = hasher args
    if ( c = cache[hash] )?
      c()
    else
      c = cache[hash] = cell()
      # and set it to a Blocking error in the meantime
      c new Blocking
      # then call the async function and set cell value when it arrives
      args.push (e, r) ->
        if e?
          if e instanceof Error
            c e
          else
            # in order to set cell to an error state
            # you MUST pass an error instance
            # so if the async function returns a plain string, for example
            # we need to wrap it
            c new Error e
        else
          c r
      f.apply null, args
      c()