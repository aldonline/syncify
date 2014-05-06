chai = require 'chai'

should = chai.should()

X   = require '../src'

delay = -> setTimeout arguments[1], arguments[0]
say_hello = ( cb ) -> delay 10, -> cb null, 'hello'

###
A Global service stores its values globally.
A subscribe will only store them for the span of an invocation.
The problem is that, when using pending(), the invocation will end.
And thus the values will be lost.
When the values arrive reactivity will invalidate the evaluation
but the value will not be present anymore as we are now operating
on a new stack.
Can we somehow retain the values of locals when pending is called?
We wil probably have to store the stack.
###
describe.skip 'local + pending + subscribe', ->
  it 'should work', (done) ->
    results = []
    say_hello_local = X say_hello
    f = ->
      if X.pending say_hello_local
        'pending'
      else
        say_hello_local()
    X.subscribe f, -> results.push arguments
    results.should.have.length 1
    results[0][1].should.equal 'pending'
    delay 20, ->
      results.should.have.length 2
      results[1][1].should.equal 'hello'
      done()