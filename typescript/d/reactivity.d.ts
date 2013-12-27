/*
Typescript definitions for the
public API of the native reactivity module.

This file also doubles as the official documentation.
*/
declare module "reactivity" {
    
    /*
    Returns a cell initialized to undefined
    */
    function r(): r.Cell<any> ;
    
    /*
    Returns a cell initialized to @value
    */
    function r<T>( value: T ): r.Cell<T> ;
    
    module r {
           
        function active( ): boolean;
           
        /*
        Runs function in a reactive context
        and returns its result
        */
        function run<T>( f: Block<T> ) : Result<T> ;
        
        /*
        Creates a subscription to the stream of values
        resulting from evaluating the function every
        time a reactive change is detected.
        
        A stopper function is returned.
        Call it to stop the subscription
        */
        function subscribe<T>( f: Block<T>, c: Callback<T> ) : Stopper ;  
        
        /*
        Returns a Notifier.
        This is used to create reactive functions
        */
        function notifier(): Notifier ;
        
        /*
        Combinator that allows you to turn any function
        into a rective function by means of polling and comparing
        its value. This is not the best way to go, but it
        a very common use case.
        */
        function poll<T>( interval: number, f: Block<T> ): Block<T> ;
        
        /*
        possible status values: ready, cancelled, changed, useless
        */
        interface Monitor extends EventEmitter, StatefulObject {
            cancel(): void
        }
        
        /*
        status values: ready, cancelled, changed
        */
        interface Notifier extends EventEmitter, StatefulObject {
            // shorthand for change
            (): void
            cancel(): void
            change(): void
        }
        
        interface Result<T> {
            result?:  T
            error?:   Error
            monitor?: Monitor
        }
        
        /*
        Function that takes no arguments and returns T
        */
        interface Block<T> { (): T }
        
        /*
        Signature for the callback that subscribe expects
        */
        interface Callback<T> { ( error?: Error, result?: T, monitor?: Monitor, stopper?: Stopper  ): void }
        
        /*
        */
        interface Stopper { (): void }
        
        interface EventEmitter {
            addListener( e: string, l: { (): void } ): void
            on( e: string, l: { (): void } ): void
            once( e: string, l: { (): void } ): void
            removeListener( e: string, l: { (): void } ): void
            removeAllListeners( e: string ): void
            // TODO: setMaxListeners listeners?
        }
        
        interface StatefulObject extends EventEmitter {
            state: String
        }
     
        /*
        A Cell is a "Reactive Variable".
        You can put anything you want in it by calling `cell( value )` ( one parameter )
        and then you can get it back by calling cell() ( with no parameters ).
        
        How do I set a cell to an error state?
        If you pass a value where ( value instanceof Error == true )
        Then the cell will automatically be set to an error state.
        
        If you wish to pass an error so that it can be stored
        you will need to wrap it into something else.
        */
        interface Cell<T> {
            
            // retrieve the current value
            // cells are initialized to undefined by default
            ( ): T
            
            // store a value
            ( v: T ): void
            
            // store an error
            ( v: Error ): void
            
            // store a value or an error
            // this allows you to pass a cell as
            // a node.js style callback directly
            ( e?: Error, v?: T ): void
        
        }
 
    }
    
  export = r;
}
