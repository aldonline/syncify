chai = require 'chai'

should = chai.should()

{delay} = require '../lib/util'
X = require '../lib'


###
These tests run in order
###
describe 'isolation', ->
  
  # this variable (y) is outside ( in a global scope )
  y = 'red'
  # (x) is in a local scope
  # this way we can combine both
  x_is_y = (x, cb) -> delay 100, -> cb null, "#{x} is #{y}"  
  # lets sync'ify it
  f0 = X x_is_y

  it 'should work', (done) ->
    f2 = X.async f0
    f2 'apple', (e, r) ->
      r.should.equal 'apple is red'
      done()

  it 'non-isolated (global) service', (done) ->
    y = 'blue'
    f2 = X.async f0
    f2 'apple', (e, r) ->
      r.should.equal 'apple is red'
      done()

  it 'isolated service', (done) ->
    true.should.equal true
    y = 'blue'
    isolated = X.isolate f0
    isolated_async = X.async isolated
    isolated_async 'apple', (e, r) ->
      r.should.equal 'apple is blue'

      # we now change the outer variable
      y = 'purple'
      isolated_async 'apple', (e, r) ->
        # but the result shouldn't notice
        # because it is isolated ( its cache is local to the stack )
        r.should.equal 'apple is blue'
        done()