/// <reference path='../d/reactivity.d.ts'/>
/// <reference path='../d/node.d.ts' />
/// <reference path='../d/mocha.d.ts' />
/// <reference path='../d/should.d.ts' />

import reactivity = require('reactivity')
import assert     = require('assert')
import events     = require('events')
import should     = require('should')

import syncify    = require('./syncify')
import util       = require('./util')

interface Done { (): void }

function echo_async<T>( v: T, cb:( e: Error, r?: T ) => void ): void {
  setTimeout( () => { ( ( <any>v ) === 'error' ) ? cb( new Error() ) : cb( null, v ) } ,  10 )
}

var echo: { <T>( v:T ): T }  = syncify( echo_async )

describe( "syncify", () => {
    it("should return a function", () => {
        should.equal( typeof echo, 'function' )
    })
})

describe( "a syncified function", () => {
  it("should throw an error when called outside an evaluation context", () => {
    echo.should.throw()
  })
})