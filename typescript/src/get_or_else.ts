import pending = require('./pending')

function get_or_else( f: () => any , v: any ): any {
    var result = undefined
    if ( pending( () => { result = f() } ) ){
        return ( typeof v === 'function' ) ? v() : v
    } else {
        return result
    }
}

export = get_or_else