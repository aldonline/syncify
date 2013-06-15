refmap      = require 'refmap'
stackval    = require 'stackval'

mab         = require './memoize_and_block'

st = stackval()

module.exports =
  attach: ( func ) ->
    m = refmap()
    st.attach func, -> m
  get: ( async_func ) ->
    m = st.get()
    unless m?
      throw new Error 'You must run this inside an unblock() context'
    m.get_or_else async_func, -> mab async_func