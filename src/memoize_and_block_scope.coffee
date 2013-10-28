stack_refmap = require './stack_refmap'
mab          = require './memoize_and_block'

sr = stack_refmap()

module.exports =
  attach: ( func ) -> sr.attach func
  get_or_create: ( async_func, hasher = JSON.stringify ) ->
    sr.get_or_else async_func, -> mab async_func, hasher
  defined: -> sr.defined()