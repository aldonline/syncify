chai = require 'chai'
should = chai.should()

blocking = require '../lib'

public_funcs = 'sync async busy get subscribe revert'

describe 'the syncify api', ->
  it 'should be a function itself', ->
    blocking.should.be.a 'function'
  
  it "should have some public functions: #{public_funcs}", ->
    funcs = public_funcs.split ' '
    blocking.should.have.keys funcs
    blocking[f].should.be.a 'function' for f in funcs