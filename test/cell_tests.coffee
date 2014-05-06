chai = require 'chai'
assert = require 'assert'
should = chai.should()

syncify = require '../src'

describe 'cell', ->
  it 'should return a function', ->
    cell1 = syncify.cell()
    cell1.should.be.a 'function'

  it 'should contain an error initially', ->
    cell2 = syncify.cell()
    assert.throws cell2

  it 'this error should be a pending error', ->
    cell3 = syncify.cell()
    syncify.pending(cell3).should.equal true