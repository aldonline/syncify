chai = require 'chai'
chai.should()
mab = require '../lib/memoize_and_block'

delay = -> setTimeout arguments[1], arguments[0]

num_calls = 0
say_hello = (name, cb) ->
  num_calls++
  delay 10, -> cb null, "Hello #{name}"

describe 'memoize_and_block', ->

  it 'should be a function', ->
    mab.should.be.a 'function'

  it 'should work', (done) ->

    say_hello_b = mab say_hello
    say_hello_b.should.be.a 'function'

    f = -> say_hello_b 'Aldo'
    f2 = -> say_hello_b 'Bob'

    f.should.throw()

    num_calls.should.equal 1
    
    delay 20, ->

      f().should.equal 'Hello Aldo'
      num_calls.should.equal 1
      f().should.equal 'Hello Aldo'
      num_calls.should.equal 1

      f2.should.throw()
      num_calls.should.equal 2 

      delay 20, ->
        f2().should.equal 'Hello Bob'
        num_calls.should.equal 2
        done()