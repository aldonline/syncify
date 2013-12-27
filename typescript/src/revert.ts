import types = require('./types')
import util  = require('./util')
import run   = require('./run')

export function revert<T>( f: types.Func<T> ) : ( ...args:any[] ) => void {
    return function() {
        var ac      = util.args_cb( arguments )
        var args    = ac.args
        var cb      = <types.RunCallback<T>> ac.cb
        run( f, args, cb )
    }
}