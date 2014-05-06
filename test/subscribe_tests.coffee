chai = require 'chai'

should = chai.should()

syncify    = require '../src'
reactivity  = require 'reactivity'

delay = -> setTimeout arguments[1], arguments[0]
times_two_async = ( num, cb ) -> delay 10, -> cb null, num * 2

describe 'subscribe', ->

  it 'should work', (done) ->

    num = reactivity()

    tt = syncify times_two_async
    func = -> tt num()

    inputs = [ 2, 3 ]
    outputs = [ 4, 6 ]

    do next = -> num inputs.shift()

    syncify.subscribe func, (e, r, m, s) ->
      if e? then console.log e.stack
      should.not.exist e
      r.should.equal outputs.shift()
      if outputs.length is 0
        s()
        done()
      else
        setTimeout next, 1