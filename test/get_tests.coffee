chai = require 'chai'

should = chai.should()

{delay} = require '../lib/util'
blocking = require '../lib'


f = (cb) -> delay 100, -> cb null, 'foo'

describe 'get', ->

  it 'should return value or fallback to a default when function is blocked', (done) ->

    f1 = blocking.block f

    f2 = -> blocking.get f1, -> 'bar'

    f3 = blocking.unblock f2

    f3 (e, r) ->
      if e? then console.log e.stack
      should.not.exist e
      r.should.equal 'bar'

      delay 200, ->

        f3 (e, r) ->
          if e? then console.log e.stack
          should.not.exist e
          r.should.equal 'foo'

          done()