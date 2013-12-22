Busy       = require './Busy'
reactivity = require 'reactivity'

class MonitorCollector
  constructor: ->
    @ms = []
  push: ( m ) ->
    if m?
      @ms.push m
  join: -> join_monitors @ms
  empty: -> @ms.length is 0
  reset: -> @ms = []

join_monitors = ( monitors ) ->
  if reactivity.active( ) and monitors.length > 0
    notifier = reactivity.notifier( )
    fired = false    
    cb = ->
      unless fired
        pending_monitors = ( m for m in monitors when m.state() is 'ready' )
        if pending_monitors.length is 0
          fired = yes
          notifier.change()
    m.once 'change', cb for m in monitors

class Executor
  run: ( f ) ->
    @parent._run_child => @_run f
  _run: ( f ) ->
    do f
  _run_child: ( f ) ->
    do f

class RootExecutor extends Executor
  run: ( f ) -> do f

class SequenceExecutor extends Executor
  constructor: ( @parent ) ->

class ParallelExecutor extends Executor
  constructor: ( @parent ) ->
    @monitors = new MonitorCollector()
    @pending_count = 0

  _run: ( f ) ->
    # run in reactive context
    res = reactivity.run f
    # by now our children executed as well
    # and we should have caught all their monitors
    # the only one missing is our own
    @monitors.push res.monitor
    # we join all of them
    @monitors.join()
    # should we throw an error?
    if @pending_count > 0
      throw new Busy()
    if res.error? then throw res.error
    # ok. cool. lets return the result
    res.result
 
  _run_child: ( f ) ->
    res = reactivity.run f
    @monitors.push res.monitor
    unless res.error?
      return res.result
    if Busy.instance res.error
      @pending_count++
    else
      throw res.error

current = new RootExecutor

around = ( opts ) -> ->
    opts.before?()    
    try
      opts.func.apply null, arguments
    finally
      opts.finally?()

with_executor = ( Ex ) -> ( f ) -> around
  before:  -> current = new Ex current
  finally: -> current = current.parent
  func:    ->
    args = arguments
    current.run -> f.apply null, args

# TODO: optimize ( remove consecutive duplicates )
module.exports =
  sequence: sequence = with_executor SequenceExecutor
  parallel: parallel = with_executor ParallelExecutor

