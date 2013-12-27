///<reference path='../d/reactivity.d.ts'/>
import types       = require('./types')
import subscribe   = require('./subscribe')
import reactivity  = require('reactivity')

/*

*/
function run<T>( f: types.Func<T>, args:any[], cb: types.RunCallback<T> ): void {
    
    function block():T{return f.apply( null, args )} ;
    
    subscribe( block, ( e:Error, r?:T, m?:reactivity.Monitor, c?:boolean, s?: () => void ) => {
        s() // stop
        cb( e, r, m, c )
    })
}

export = run