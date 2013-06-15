chai = require 'chai'
chai.should()

blocking = require '../lib'

describe 'the blocking.js api', ->
  it 'should be a function', ->
    blocking.should.be.a 'function'
  
  it 'should have some public functions', ->
    funcs = 'block unblock blocked Blocking'.split ' '
    blocking.should.have.keys funcs
    blocking[f].should.be.a 'function' for f in funcs