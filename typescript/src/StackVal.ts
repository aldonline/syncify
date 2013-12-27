/// <reference path='../d/reactivity.d.ts'/>
export class StackVal<T> {

    private stack: T[] = []

    constructor( private error_message: string = "stackval is empty" ){ }
    
    attach<P>( f:(...args: any[]) => P, generator: ( ) => T ): (...args: any[]) => P {
        var sv = this
        return function( ): P {
            try {
                sv.stack.push( generator( ) )
                return f.apply( this, arguments )
            } finally {
                sv.stack.pop( )
            }
        }
    }
    
    recover( ): T {
        if( this.defined( ) ){
            return this.stack[ this.stack.length - 1 ]
        } else {
            throw new Error( this.error_message )
        }
    }
    
    defined( ): boolean { return this.stack.length > 0 }
}