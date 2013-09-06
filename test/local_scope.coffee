chai = require 'chai'

should = chai.should()

{delay} = require '../lib/util'
X = require '../lib'


people =
  aldo: 'Aldo'
  bob:  'Bob'

uc = X ( str, cb ) -> delay 10, -> cb null, str.toUpperCase()
get_name = X ( id, cb ) -> delay 10, -> cb null, people[id]
get_name_uc = (id) -> uc get_name id

###
The testing strategy is the following.
We create two
###
describe 'a syncified function with local scope', ->
  
  it 'should retain its value during the lifecycle of a stack', (done) ->
    X.async(get_name_uc) 'aldo', (e, r) ->
      r.should.equal 'ALDO'
      done()

  it 'but should not retain a value when used in a new stack', (done) ->
    people.aldo = 'Aldo Bucchi'
    X.async(get_name_uc) 'aldo', (e, r) ->
      r.should.equal 'ALDO BUCCHI'
      done()