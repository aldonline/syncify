///<reference path='../d/reactivity.d.ts'/>
import Dictionary   = require('./Dictionary')
import Invocation   = require('./Invocation')
import Service      = require('./Service')

export class ServiceCache  {
    
    // the key used to store an invocation is the hash() of its arguments
    private cache = new Dictionary.Dictionary<Invocation>( )
    
    constructor( public service: Service.Service ){ }
    
    private getInvocation = ( args: any[] ): Invocation =>
        this.cache.getOrCreate( this.service.hasher( args ), ( ) => this.service.runDirectly( args ) )
        
    // this may throw a pending error
    run = ( args: any[] ) => this.getInvocation( args ).getResult( )
}