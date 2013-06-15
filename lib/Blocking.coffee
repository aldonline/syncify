X = {}
module.exports = class Blocking extends Error
  constructor: ->
    @__x = X
  toString: -> 'Blocking'
  # safer test to see if an object is an instance
  @instance: ( i ) -> i?.__x is X