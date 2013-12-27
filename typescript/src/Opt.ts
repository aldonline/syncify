/// <reference path='../d/reactivity.d.ts'/>
import util  = require('./util')
import types = require('./types')

// immutable
export class Opt<T> {
  
  private _v: T = undefined
  length = 0
  
  constructor()
  
  constructor( v?: T ) {
    this._v = v
    if ( typeof v !== 'undefined' ) this.length = 1
  }
  
  defined( ): boolean { return this._v !== undefined }
  
  empty(): boolean { return ! this.defined() }
  
  get( strict: boolean = false ): T {
    if ( strict && this.empty() ) throw new Error('value not found') 
    return ( this.empty() ) ? undefined : this._v
  }
  
  getOrElse( generator: { (): any } ): any {
    return this.defined() ? this._v : generator() ;
  }
  
  map<X>( f:( v:T ) => X ): Opt<X> { return this.defined() ? new Opt( f(this._v) ) : Opt.none }
  
  forEach( f:( v:T ) => void ){ if ( this.defined() ) f( this._v ) }
  
  equals( other:any, eq: types.Comparator = util.EQ  ): boolean {
     return ( other instanceof Opt ) && ( eq( this.get(), other.get() ) )
  }
  
  static none  = new Opt<any>( )
}