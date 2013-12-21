chai   = require 'chai'

should = chai.should()

X      = require '../lib'

delay     = -> setTimeout arguments[1], arguments[0]
serial = 0
say_hello = ( cb ) -> delay 10, -> cb null, 'hello ' + serial++


describe 'global + subscribe + reset', ->
  it 'should work', (done) ->
    
    serial = 0 # reset state

    say_hello_global = X say_hello, global: yes
    
    say_hello_global.reset.should.be.a 'function'

    results = []

    X.subscribe say_hello_global, -> results.push arguments
    results.should.have.length 0

    delay 20, ->
      results.should.have.length 1
      results[0][1].should.equal 'hello 0'
      say_hello_global.reset() # trigger a refresh
      results.should.have.length 1 # nothing yet ( service is fetching new result )

      delay 20, ->
        results.should.have.length 2
        results[0][1].should.equal 'hello 0'
        results[1][1].should.equal 'hello 1'

        done()