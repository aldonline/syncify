chai = require 'chai'

should = chai.should()

util = require '../lib/util'
blocking = require '../lib'

describe 'block', (done) ->

  it 'should block an async function', ->

    f1 = blocking.block util.say_hello_delayed
    f1.should.be.a 'function'
    f1.should.throw() # should throw a Blocking error

    f2 = blocking.unblock f1
    f2.should.be.a 'function'

    f2 'Aldo', (e, r) ->
      console.log 'after'
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo'
      done()


describe 'block', (done) ->
  it 'should block and unblock combined functions', ->
    f1 = blocking.block util.say_hello_delayed

    f2 = (message) -> f1('Aldo') + ', ' + f1('Bob') + ' ' + message

    f3 = blocking.unblock f2

    f3 'how are you', (e, r) ->
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo, Hello Bob how are you'
      done()      

    f4 = (message) -> f2(message).toUpperCase()

    f5 = blocking.unblock f4

    f5 'how are you', (e, r) ->
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo, Hello Bob how are you'.toUpperCase()
      done()      