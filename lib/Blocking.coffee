
KEY = '___BLOCKING_ERROR___'

module.exports = class Blocking extends Error
  constructor: ->
    @[KEY] = yes

  toString: -> 'Blocking'

  # Since several instances of this module may be loaded at once
  # we need a global way of checking if an object is an instance of
  # a blocking error or not.
  # This allows for module interoperability.
  # ( remember that CommonJS dictates that several modules must be loaded at once )
  @instance: ( i ) ->
    i instanceof Error and i[KEY] is yes