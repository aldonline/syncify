/// <reference path='../d/reactivity.d.ts'/>
/// <reference path='../d/node.d.ts' />
/// <reference path='../d/mocha.d.ts' />
/// <reference path='../d/should.d.ts' />

import reactivity = require('reactivity')
import assert     = require('assert')
import events     = require('events')
import should     = require('should')

import syncify    = require('./syncify')
import subscribe  = require('./subscribe')
import util       = require('./util')

interface Done { (): void }

function echo_async<T>( v: T, cb: ( e: Error, r?: T ) => void ): void {
    util.delay(
        10,
        () => {
            ( ( <any>v ) === 'error' ) ?
                cb( new Error() ) :
                cb( null, v ) }
    )
}

var echo: { <T>( v:T ): T }  = syncify( echo_async )

describe( "subscribe", () => {
  it( "should work", ( done: Done ) => {
    var result = null
    subscribe( () => echo('hello') , ( e: Error, r?: string ) => {
        result = r
        r.should.equal('hello')
        done()
    })
    should.not.exist( result )
  })
})





