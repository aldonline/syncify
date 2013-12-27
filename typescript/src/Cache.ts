///<reference path='../d/reactivity.d.ts'/>
import Dictionary     = require('./Dictionary')
import StackVal       = require('./StackVal')
import ServiceCache   = require('./ServiceCache')
import Service        = require('./Service')
import types          = require('./types')

var sv = new StackVal.StackVal<Cache>( 'You cannot run a syncified function directly. Use syncify.subscribe()' )

export class Cache {
    private cache = new Dictionary.Dictionary<ServiceCache.ServiceCache>()
    // creates a ServiceCache for a given Service
    // we use Service.id as key
    getOrCreate = ( m: Service.Service ): ServiceCache.ServiceCache => this.cache.getOrCreate( m.id.toString(), () => new ServiceCache.ServiceCache(m) )
    
    reset = () => this.cache.reset( )
    
    // TODO: does it make sense to attach a Cache to more than one function?
    // if it does not we could set a restriction
    attach<T>( f: types.Func<T> ) : types.Func<T> { return sv.attach( f , () => this ) }
    
    static current(){ return sv.recover() }
}