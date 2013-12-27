///<reference path='../d/reactivity.d.ts'/>
import util             = require('./util')
import types            = require('./types')
import PRE              = require('./PendingResultError')
import MonitorCollector = require('./MonitorCollector')
import R                = require('reactivity')
import B                = types.Block
import reactivity_util  = require('./reactivity_util')

var serial = 0


function LOG( msg: string ){
    console.log( msg )
}


/*
Executors allow you to modify the blocking control flow.
By default every pending error will stop execution.
This module allows you to intercept blocks, catch batches of errors
and consolidate them in different ways to modify concurrency.
*/

class Executor {
    type(){ return 'base'}
    _id: number = 0
    path(){ return this.parent.path() + '.' + this.id() }
    id(){ return this.type() + '(' + this._id + ')' }
    log( msg: string ){ LOG( this.path() + ' -> ' + msg ) } 
    
    constructor( public parent: Executor ){
        this._id = serial++
        this.log( 'constructor()' )
    }
    run<T>( f: B<T> ):        T {
        this.log('run()')
        return this.parent._run_child( () => this._run( f ) ) }
    _run_child<T>( f: B<T> ): T {
        this.log('_run_child()')        
        return f() }
    _run<T>( f: B<T> ):       T {
        this.log('_run()')         
        return f() }
}

// Root executor has no parent
class RootExecutor extends Executor {
    constructor( ){ super( undefined ) }
    run<T>( f: B<T> ): T { return f() }
    path(){ return this.id() + '' }
}

class SequenceExecutor extends Executor {
    type(){ return 'seq'}
    private pending = false
    _run<T>( f:B<T> ): T {
        this.pending = false
        return f()
    }
    _run_child<T>( f:B<T> ): T {
        this.log('_run_child??!')
        if ( ! this.pending ){
            var res = R.run( f )
            if ( PRE.status( res.error ) === PRE.Status.Pending ) this.pending = true;
            return reactivity_util.bubbleResult( res )
        } else {
            this.log('not running. pending')
        }
    }
}

class ParallelExecutor extends Executor {
    type(){ return 'par'}
    private monitors = new MonitorCollector.MonitorCollector()
    private pending_count = 0
    run<T>( f: B<T> ):        T {
        this.log('run()')
        return super.run( f )
    }
    _run<T>( f: B<T> ): T {
        this.log( '_run()' )
        // run in reactive context
        var res = R.run( f )
        // by now our children executed as well
        // and we should have caught all their monitors
        // the only one missing is our own
        this.monitors.push( res.monitor )
        // we join all of them
        this.monitors.join()
        // should we throw an error?
        this.log( '_run().pending_count ' + this.pending_count )
        if ( this.pending_count > 0 )   throw new PRE()
        if ( util.exists( res.error ) ) throw res.error
        // ok. cool. lets return the result
        return res.result
    }
    _run_child<T>( f:B<T> ): T {
        this.log( '_run_child()' )
        var res = R.run( f )
        this.monitors.push( res.monitor )
        switch( PRE.status( res.error ) ) {
            case PRE.Status.Ready   : return res.result
            case PRE.Status.Error   : throw  res.error
            case PRE.Status.Pending : this.pending_count++
        }
    }
}

var current = new RootExecutor()

var withExecutor = ( build: ( p: Executor ) => Executor  ) => <T>( f: B<T> ): B<T> => util.around(
    () => { current = build( current ) }, // push
    () => { current = current.parent },   // pop
    () => {                               // run
        var a = arguments ;  return current.run( () => f.apply( null, a ) )
    }
)



// combinators
export var withSequence = withExecutor( (p: Executor) => new SequenceExecutor( p ) )
export var withParallel = withExecutor( (p: Executor) => new ParallelExecutor( p ) )
// applicators
export function parallel<T>( f: types.Block<T> ): T { return withParallel( f )() }
export function sequence<T>( f: types.Block<T> ): T { return withSequence( f )() }
