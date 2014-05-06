chai = require 'chai'

should = chai.should()

{delay} = require '../src/util'
syncify = require '../src'


f = (cb) -> delay 10, -> cb null, 'foo'

describe 'get', ->

  it 'should return value or fallback to a default when function is pending', (done) ->

    f1 = syncify f

    f2 = -> syncify.get f1, -> 'bar'

    f3 = syncify.revert f2

    f3 (e, r) ->
      if e? then console.log e.stack
      should.not.exist e
      r.should.equal 'bar'

      delay 20, ->

        f3 (e, r) ->
          if e? then console.log e.stack
          should.not.exist e
          r.should.equal 'foo'

          done()