///<reference path='../d/reactivity.d.ts'/>
import util = require('./util')
import reactivity = require('reactivity')

// invokes an async function
exports = function invoke( f: Function, args: any[] ): () => any {
    var cell = reactivity()
    var cb   = (e,r) => {  util.exists(e) ? cell(e) : cell(r) }
    f.apply( null, args.concat([cb]) )
    return () => cell()
}