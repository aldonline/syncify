/// <reference path='../d/reactivity.d.ts'/>
import reactivity = require('reactivity')

export function bubbleMonitor( m: reactivity.Monitor ){
    var n = reactivity.notifier()
    if ( reactivity.active( ) ) m.once('change', ( ) => n.change( ) )
}

export function bubbleResult<T>( r:reactivity.Result<T> ): T {
    if ( r.monitor ) bubbleMonitor( r.monitor )
    if ( r.error ) throw r.error
    return r.result
}