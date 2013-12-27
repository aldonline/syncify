///<reference path='../d/reactivity.d.ts'/>
import R        = require('reactivity')
import statics  = require('./statics')

// analog to reactivity.run
// but exposes a fourth property complete:boolean
export class Result<T> {
    constructor(
        public error?: Error,
        public result?: T,
        public monitor?: R.Monitor,
        public complete: boolean = true
    ){ }
}

export function run<T>( block: ()=>T ) : Result<T> {
    statics.resetIncomplete( )
    var res      = R.run( block )
    var complete = ( ! statics.getIncomplete( ) )
    return new Result( res.error, res.result, res.monitor, complete )
}