/// <reference path='../d/reactivity.d.ts'/>
import reactivity = require('reactivity')
import util       = require('./util')

export class MonitorCollector {
  
    private ms: reactivity.Monitor[] = []

    push( m: reactivity.Monitor ){ if ( util.exists( m ) ) this.ms.push( m ) }

    join(){ joinMonitors( this.ms ) }

    empty(){ return this.ms.length === 0 }

    reset(){ this.ms = [] }
}




function joinMonitors( monitors: reactivity.Monitor[] ){
    if ( reactivity.active( ) && monitors.length > 0 ){
        var notifier = reactivity.notifier( )
        var len = monitors.length
        var cb = ( ) => { if ( --len === 0 ) notifier.change( ) }
        monitors.forEach( ( m ) => { m.once( 'change', cb ) } )
    }
}
