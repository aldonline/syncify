chai = require 'chai'

should = chai.should()

blocking   = require '../lib'
rcell      = require 'reactive-cell'

delay = -> setTimeout arguments[1], arguments[0]
times_two_async = ( num, cb ) -> delay 100, -> cb null, num * 2

describe 'subscribe', ->

  it 'should work', (done) ->

    num = rcell()

    tt = blocking.block times_two_async
    func = -> tt num()

    inputs = [ 2, 3 ]
    outputs = [ 4, 6 ]

    do next = -> num inputs.shift()

    blocking.subscribe func, (e, r, m, s) ->
      r.should.equal outputs.shift()
      if outputs.length is 0
        s()
        done()
      else
        setTimeout next, 1