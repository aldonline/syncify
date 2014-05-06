chai = require 'chai'
should = chai.should()

syncify = require '../src'

public_funcs = 'pending get subscribe revert parallel sequence'

describe 'the syncify api', ->
  it 'should be a function itself', ->
    syncify.should.be.a 'function'
  
  it "should have some public functions: #{public_funcs}", ->
    funcs = public_funcs.split ' '
    syncify.should.have.keys funcs
    syncify[f].should.be.a 'function' for f in funcs