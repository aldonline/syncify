///<reference path='../d/reactivity.d.ts'/>

import types = require('./types')

var __i = 0

export var serial = (): number =>  __i++

export var arr = ( arrayish: any ): any[] => ( <any[]> Array.prototype.slice.apply( arrayish ) );

export function arrp<T>( xs:T[], x:T ): T { xs.push( x ) ;  return x }

export function args_cb( raw_args: any ){
    var args_arr = arr( raw_args )
    var cb = args_arr.pop()
    return {
        args: args_arr,
        cb: <Function> cb
    }
}

export var exists = ( v: any ): boolean => ( ( typeof v !== 'undefined' )  && ( v !== null ) )

export function delay( ms: number, f: Function ): types.Stopper {
  var i = setTimeout( f, ms )
  return ( ) => clearTimeout( i )
}

export var EQ = ( a: any , b: any ) => a === b

export var last = <T>( arr:T[] ) => arr[arr.length - 1]

export function around<T>(
  before: () => void,
  fin:    () => void,
  func:   () => T
  ): () => T {
    return () => {
        var a = arguments
        try {
            before()
            return func.apply(null, a)
        } finally { fin() }
    }
}