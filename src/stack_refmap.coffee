refmap   = require 'refmap'
stackval = require 'stackval'

###
Attaches a reference map to the stack
TODO: inherit
###

class StackRefmap
  constructor:  -> @sv = stackval()
  # attach a new refmap to the stack of this function
  attach: ( f ) =>
    m = refmap()
    @sv.attach f, -> m
  get: ( key )  => @sv.get().get key
  get_or_else: ( key, generator ) => @sv.get().get_or_else key, generator
  defined: -> @sv.defined()

module.exports = -> new StackRefmap