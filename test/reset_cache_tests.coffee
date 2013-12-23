chai = require 'chai'

should = chai.should()

util = require '../lib/util'
syncify = require '../lib'

describe 'f.reset()', ->

  it 'should allow us to reset the cache of a blocked function', (done) ->

    f1 = syncify util.say_hello_delayed
    f1.should.be.a 'function'
    # ( -> f1 'Aldo' ).should.throw() # throw a Blocking error

    f2 = syncify.revert f1
    f2.should.be.a 'function'

    f2 'Aldo', (e, r) ->
      if e?
        console.log e.stack
      should.not.exist e
      r.should.equal 'Hello Aldo'

      # rest f2

      done()