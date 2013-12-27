/// <reference path='../d/reactivity.d.ts'/>
import reactivity = require('reactivity')

// a Hasher is a function that takes any value and returns a Hash ( string )
export interface Hasher { ( any ): string }
// an async is simply a function. we don't know much
// return type is hidden in a callback
// and number of arguments is variable
export interface AsyncFunc extends Function {}

export interface Func<T>  { ( ...args:any[] ): T }
export interface Block<T> { () : T }

export interface Stopper { (): void }

export interface Comparator {
  ( a: any, b: any) : boolean
}

export interface SubscribeCallback<T> {
    (
        error:      Error,
        result?:    T,
        monitor?:   reactivity.Monitor,
        complete?:  boolean,
        stopper?:   () => void
    ) : void 
}

export interface RunCallback<T> {
    (
        error:      Error,
        result?:    T,
        monitor?:   reactivity.Monitor,
        complete?:  boolean 
    ) : void
}