cell      = require 'reactive-cell'
util      = require './util'
Blocking  = require './Blocking'

###
GC Warning:
This memoized version of the function will store results indefinitely
in its internal cache.
This won't be problem if you're scoping function instances properly
and let the native GC take care of disposing it

@f an async function ( that takes a node-style callback )
@hasher an optional function that must return a string
        it will receive a set of arguments as input
###
module.exports = ( f, hasher = JSON.stringify ) ->
  cache = {}
  ->
    args = util.arr arguments
    hash = hasher args
    if ( c = cache[hash] )?
      # there is a cell for this combination
      # lets 
      c()
    else
      # for each hash ( which should represent a distinct combination of arguments )
      # we create a new cell
      c = cache[hash] = cell()
      # and set it to a Blocking error in the meantime
      c new Blocking
      # then call the async function and set cell value when it arrives
      args.push (e, r) ->
        if e?
          if e instanceof Error
            c e
          else
            # Not an error. We need to fix this.
            # In order to set cell to an error state
            # you MUST pass an error instance
            # so if the async function returns a plain string, for example
            # we need to wrap it
            c new Error e
        else
          # set the newly received result as the cell value
          c r

      f.apply null, args
      c()