chai = require 'chai'
should = chai.should()

blocking = require '../lib'

delay = -> setTimeout arguments[1], arguments[0]
say_hello = (name, cb) -> delay 10, -> cb null, "Hello #{name}"

describe 'Blocking error', ->
  it 'test with instanceof', ->
    be = new blocking.Blocking
    be.should.be.an.instanceof blocking.Blocking
    be.should.be.an.instanceof Error

describe 'simple blocking', ->
  it 'should work', ( done ) ->
    
    f1 = blocking say_hello
    f1.should.be.a 'function'
    
    f2 = blocking.unblock -> f1 'Aldo'
    f2.should.be.a 'function'

    f2 (e, r) ->
      should.not.exist e
      r.should.equal 'Hello Aldo'
      done()