///<reference path='../d/reactivity.d.ts'/>
import Opt = require('./Opt')

export class Dictionary<V> {
    
    private obj:{ [k: string]: V } = { }
    
    getOrCreate( key: string, generator: ( ) => V ) : V {
      return ( this.defined( key ) ) ? this.obj[key] : ( this.obj[key] = generator() )
    }
    
    get( key: string ): V { return this.obj[key]  }
    
    set( key: string, value: V): V { return this.obj[key] = value }
    
    defined( key: string ): boolean { return this.obj.hasOwnProperty( key ) }
    
    opt( key: string ): Opt.Opt<V> { return this.defined( key ) ? new Opt.Opt( this.get( key ) ) : Opt.Opt.none }
    
    reset( ){ this.obj = { } }
    
    resetKey( key: string ){ delete this.obj[key] }
}