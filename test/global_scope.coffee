chai = require 'chai'

should = chai.should()

{delay} = require '../lib/util'
X = require '../lib'


###
These tests run in order
###
describe 'a syncified function with global scope', ->
  
  # this variable (y) is outside
  y = 'red'
  # (x) is in a local scope
  # this way we can combine both
  x_is_y = (x, cb) -> delay 100, -> cb null, "#{x} is #{y}"  
  # lets sync'ify it
  x_is_y__global = X x_is_y, global: yes

  it 'global', (done) ->
    X.async(x_is_y__global) 'apple', (e, r) ->
      r.should.equal 'apple is red'
      done()

  it 'global should always return a cached result', (done) ->
    y = 'blue'
    X.async(x_is_y__global) 'apple', (e, r) ->
      r.should.equal 'apple is red'
      done()