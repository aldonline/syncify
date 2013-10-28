
KEY = '___SOME_PATIENCE_PLEASE___'

module.exports = class Busy extends Error
  constructor: ->
    @[KEY] = yes

  toString: -> 'Busy'

  # Since several instances of this module may be loaded at once ( CommonJS works this way )
  # we need a global way of checking if an object is an instance of
  # a blocking error or not. This allows for module interoperability.
  @instance: ( i ) ->
    i instanceof Error and i[KEY] is yes