///<reference path='../d/reactivity.d.ts'/>
import Service              = require("./Service")
import types                = require('./types')
import util                 = require('./util')
import executors            = require('./executors')


/*
We don't need to syncify functions before calling them
within syncify blocks.
We just call them like this:
syncify original_async_func, 

we can automatically syncify all jquery ajax functions!
when running inside a block
*/

// create a closure over a Service instance
// you can then call this function as if it were completely sync
function syncify(
    f:      ( ...args: any[] ) => void ,
    hasher: types.Hasher = JSON.stringify
    ) : ( ...args: any[] ) => any {
    
    var service = new Service.Service( f, hasher )
    
    return executors.withSequence( () => service.runWithCache( util.arr( arguments ) ) )
}

export = syncify