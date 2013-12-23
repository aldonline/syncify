chai = require 'chai'

should = chai.should()

{delay}  = require '../lib/util'
syncify = require '../lib'


class Collector
  constructor: ->
    @arr = []
  run: ( i, cb ) =>
    @arr.push i + '?'
    delay 10, =>
      @arr.push i + ''
      cb()
  runner: => syncify @, @run
  dump: -> @arr.join ' '




r1 = '0? 0 1? 1 2? 2 3? 4? 5? 3 4 5'
f1 = ( run ) ->
  run 0
  run 1
  run 2
  syncify.parallel ->
    run 3
    run 4
    run 5

describe 'seq( x, x, parallel( x, x) )', ->
  it 'should work', (done) ->
    syncify f1, [ ( coll2 = new Collector ).runner() ], (e, r) ->
      coll2.dump().should.equal r1
      done()





r2 = '0? 0 1? 1 2? 3? 2 3 4? 5? 4 5'
f2 = (run) ->
  run 0
  run 1
  syncify.parallel ->
    run 2
    run 3
  syncify.parallel ->
    run 4
    run 5

describe 'seq( x, x, parallel( x, x ), parallel( x, x ) )', ->
  it 'should work', (done) ->
    syncify f2, [ ( coll2 = new Collector ).runner() ], (e, r) ->
      coll2.dump().should.equal r2
      done()





r3 = '0? 0 1? 1 2? 3? 4? 2 3 4'
f3 = (run) ->
  run 0
  run 1
  syncify.parallel ->
    run 2
    run 3
    syncify.sequence ->
      run 4

# TODO: this is not ending
describe 'seq( x, x, parallel( x, x, seq( x ) )', ->
  it 'should work', (done) ->
    syncify f3, [ ( coll3 = new Collector ).runner() ], (e, r) ->
      coll3.dump().should.equal r3
      done()





r4 = '0? 0 1? 1 2? 3? 4? 2 3 4 5? 5'
f4 = (run) ->
  run 0
  run 1
  syncify.parallel ->
    run 2
    run 3
    syncify.sequence ->
      run 4
      run 5

# TODO: this is not ending
# the difference with the one above is that it has
# one more element in the final sequence
describe.skip 'seq( x, x, parallel( x, x, seq( x, x ) )', ->
  it 'should work', (done) ->
    syncify f4, [ ( coll4 = new Collector ).runner() ], (e, r) ->
      coll4.dump().should.equal r4
      done()


