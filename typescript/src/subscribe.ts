///<reference path='../d/reactivity.d.ts'/>
import reactivity       = require('reactivity')
import types            = require('./types')
import PRE              = require('./PendingResultError')
import rrun             = require('./reactivity_run')
import Cache            = require('./Cache')
import util             = require('./util')
import reactivity_util  = require('./reactivity_util')

interface Result<T> {
  result:   T
  error:    Error
  complete: boolean
  // TODO: monitor
}

/*
class Subscription<T> {

  // states: init, pending, ready, disconnected
  
  private stateCell  = reactivity()
  private resultCell = reactivity()
  
  constructor( public block: types.Block<T> ) {
    
  }
  
  // returns the last value we could get from the subscription
  lastResult( ): Result<T> {
    
  }
  
  // whether there is any work going on
  // this is a reactve property
  state( ) : string { return this.stateCell() }
  
  // a Subscription keeps its own cache for all
  // internal syncified services.
  // Call this method to delete it and force
  // reevaluation of the complete expression
  refresh( ) {
  
  }
  
  disconnect( ){
    
  }

}
*/



function subscribe<T>( block: types.Block<T>, cb: types.SubscribeCallback<T>  ): { ( ): void ; refresh: ( ) => void } {
    
    var cache       = new Cache.Cache()
    block           = cache.attach( block )
    var stopped     = false
    var stopper     = () => { unmon() ; stopped = true }
    var refresh     = () => { unmon();  cache.reset() ; iter() } ;
    
    function unmon(){ if ( util.exists( mon ) ) mon.removeListener( 'change', iter ) }
    var mon: reactivity.Monitor = null

    var iter = (): void => {
        
        var res: rrun.Result<T> = rrun.run( block )

        if ( PRE.status( res.error ) === PRE.Status.Pending ){

            res.monitor.once( 'change', iter )

        } else {
            // cache only lives through one complete execution
            // this is an arbitrary heuristic
            if ( res.complete ) cache.reset() 
            
            cb( res.error, res.result, res.monitor, res.complete, stopper )
        
        }
    }
    iter();

    ( <any> stopper ).refresh = refresh
    return <{ (): void ; refresh: ()=>void }> stopper
}

export = subscribe