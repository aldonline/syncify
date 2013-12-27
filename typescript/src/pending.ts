///<reference path='../d/reactivity.d.ts'/>
import R         = require('reactivity')
import PRE       = require('./PendingResultError')
import statics   = require('./statics')
import util      = require('./util')
import reactivity_util = require('./reactivity_util')

/*
This is a tricky feature to implement.
*/
function pending<T>( f:() => T ): boolean {
    var res = R.run( f )
    
    reactivity_util.bubbleMonitor( res.monitor )
    
    switch ( PRE.status( res.error ) ){
        
        case PRE.Status.Pending:
            statics.informIncomplete( )
            return true
        
        case PRE.Status.Ready:
            return false
        
        case PRE.Status.Error:
            throw res.error
    }
}

export = pending