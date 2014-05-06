chai = require 'chai'

should = chai.should()

util = require '../src/util'
syncify = require '../src'

describe 'sync', ->

  it 'should block an async function', (done) ->

    f1 = syncify util.say_hello_delayed
    f1.should.be.a 'function'
    f1.should.throw() # should throw a Blocking error

    f2 = syncify.revert f1
    f2.should.be.a 'function'

    f2 'Aldo', (e, r) ->
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo'
      done()

  it 'should block and unblock combined functions', (done) ->
    f1 = syncify util.say_hello_delayed

    f2 = (message) -> f1('Aldo') + ', ' + f1('Bob') + ' ' + message

    f3 = syncify.revert f2

    f3 'how are you', (e, r) ->
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo, Hello Bob how are you'    

      f4 = (message) -> f2(message).toUpperCase()

      f5 = syncify.revert f4

      f5 'how are you', (e, r) ->
        if e?
          console.log e.stack
        should.not.exist e
        r.should.equal 'Hello Aldo, Hello Bob how are you'.toUpperCase()
        done()      