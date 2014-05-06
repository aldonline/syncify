

###
Composition:

Local/Global
With Arguments / Without Arguments
###



chai    = require 'chai'
should  = chai.should()
reactivity   = require 'reactivity'
X       = require '../src'

delay = -> setTimeout arguments[1], arguments[0]

to_upper_case_async            = (str, cb) -> delay 10, -> cb null, str.toUpperCase()
to_upper_case_syncified_local  = X to_upper_case_async
# global does not make sense. This is a pure function

remote_text = 'a'
get_remote_text_async  = ( cb ) -> delay 10, -> cb null, remote_text
get_remote_text_syncified_local  = X get_remote_text_async
get_remote_text_syncified_global = X get_remote_text_async, global: true

local_cell = reactivity 'x'

mix1 = -> to_upper_case_syncified_local( local_cell() ) + get_remote_text_syncified_local()
mix2 = -> to_upper_case_syncified_local( local_cell() ) + get_remote_text_syncified_global()

mix1_async = X.revert mix1
mix2_async = X.revert mix2

reset = ->    
  remote_text = 'a'
  local_cell 'x'

describe 'mixed', ->
  it 'local', (done) ->
    reset()
    results = []
    stopper = X.subscribe mix1, -> results.push arguments
    results.should.have.length 0
    delay 30, -> # wait for both services to return
      results.should.have.length 1
      r = results[0]
      should.not.exist r[0]
      r[1].should.equal 'Xa'
      # make a change
      local_cell 'y'
      # nothing changes right away
      results.should.have.length 1
      delay 30, -> # wait for both services to return
        results.should.have.length 2
        r = results[1]
        should.not.exist r[0]
        r[1].should.equal 'Ya'
        # change remote text
        remote_text = 'b'
        # nothing changes 
        results.should.have.length 2
        delay 30, ->
          # even after 30 ms ( remote text is not reactive )
          results.should.have.length 2
          # but now we change the local cell
          local_cell 'z'
          # and nothing changes right away
          results.should.have.length 2
          delay 30, -> # but after a while...
            results.should.have.length 3
            r = results[2]
            should.not.exist r[0]
            r[1].should.equal 'Zb'
            stopper()
            done()


  it 'global', (done) ->
    reset()
    results = []
    stopper = X.subscribe mix2, -> results.push arguments
    results.should.have.length 0
    delay 30, -> # wait for both services to return
      results.should.have.length 1
      r = results[0]
      should.not.exist r[0]
      r[1].should.equal 'Xa'
      # make a change
      local_cell 'y'
      # nothing changes right away
      results.should.have.length 1
      delay 30, -> # wait for both services to return
        results.should.have.length 2
        r = results[1]
        should.not.exist r[0]
        r[1].should.equal 'Ya'
        # change remote text
        remote_text = 'b'
        # nothing changes
        results.should.have.length 2
        delay 30, ->
          # even after 30 ms ( remote text is not reactive )
          results.should.have.length 2
          # but now we change the local cell
          local_cell 'z'
          # and nothing changes right away
          results.should.have.length 2
          delay 30, -> # but after a while...
            results.should.have.length 3
            r = results[2]
            should.not.exist r[0]
            # get_remote_text is a global service
            # ergo the change to remote_text is not picked up
            # it retains its original value of 'a'
            r[1].should.equal 'Za'
            stopper()
            done()
