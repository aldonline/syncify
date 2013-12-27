/// <reference path='../d/reactivity.d.ts'/>
/// <reference path='../d/node.d.ts' />
/// <reference path='../d/mocha.d.ts' />
/// <reference path='../d/should.d.ts' />

import reactivity = require('reactivity')
import assert     = require('assert')
import events     = require('events')
import should     = require('should')

import syncify    = require('./syncify')
import run        = require('./run')
import executors  = require('./executors')
import util       = require('./util')
import types      = require('./types')


interface Runner{ ( i:number ): void }

class Collector {
    
    arr: string[] = []

    run( i: number, cb: Function ) {
        this.arr.push( i + "?")
        console.log( '-- ' + i + '?' )
        util.delay( 10, () => {
            console.log( '-- ' + i )
            this.arr.push( i + '' ) ; cb( ) })
    }
    runner( ): Runner {
        var f = ( i: number , cb:Function ) => this.run( i , cb )
        return syncify( f )
    }
    dump( ): string { return this.arr.join(' ') }
}





var r1 = '0? 0 1? 1 2? 2 3? 4? 5? 3 4 5'

function f1( run: Runner  ) {
    run(0)
    run(1)
    run(2)
    executors.parallel( function(){
        run(3)
        run(4)
        run(5)
    })
}



describe('seq( x, x, x parallel( x, x, x )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f1, [ c.runner() ], function( ){
            c.dump().should.equal( r1 )
            done()
        })
    })
})





var r2 = '0? 0 1? 1 2? 3? 2 3 4? 5? 4 5'
function f2(run) {
    run(0)
    run(1)
    executors.parallel(function(){
        run(2)
        run(3)
    })
    executors.parallel(function(){
        run(4)
        run(5)
    })
}

describe('seq( x, x, parallel( x, x ), parallel( x, x ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f2, [ c.runner() ], function( ){
            c.dump().should.equal( r2 )
            done()
        })
    })
})







var r3 = '0? 0 1? 1 2? 3? 4? 2 3 4'
function f3(run){
    run(0)
    run(1)
    executors.parallel(function(){
        run(2)
        run(3)
        executors.sequence(function(){
            run(4)      
        })
    })
}

describe('seq( x, x, parallel( x, x, seq( x ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f3, [ c.runner() ], function( ){
            c.dump().should.equal( r3 )
            done()
        })
    })
})



var r4 = '0? 0 1? 1 2? 3? 4? 2 3 4 5? 5'
function f4(run){
    run(0)
    run(1)
    executors.parallel(function(){
        run(2)
        run(3)
        executors.sequence(function(){
            console.log('before 4')
            run(4)      
            console.log('after 4')
            
            console.log('before 5')
            run(5)
            console.log('after 5')
        })
    })
}

describe.only('seq( x, x, parallel( x, x, seq( x, x ) )', function(){
    it('should work', function( done ){
        var c = new Collector( )
        run( f4, [ c.runner() ], function( ){
            c.dump().should.equal( r4 )
            done()
        })
    })
})









var r5 = '0? 0 1? 1 2? 2 3? 3 4? 4 5? 5'
function f5(run){
    run(0)
    run(1)
    executors.sequence(function(){
        run(2)
        run(3)
        executors.sequence(function(){
            run(4)      
            run(5)
        })
    })
}

describe('seq( x, x, seq( x, x, seq( x, x ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f5, [ c.runner() ], function( ){
            c.dump().should.equal( r5 )
            done()
        })
    })
})














var r6 = '1? 1 2? 2'
function f6(run){
    executors.parallel(function(){
        executors.sequence(function(){
            run(1)
            run(2)
        })
    })
}

describe('seq( parallel( seq( x, x ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f6, [ c.runner() ], function( ){
            c.dump().should.equal( r6 )
            done()
        })
    })
})









var r7 = '1? 1 2? 2'
function f7(run){
    executors.sequence(function(){
        executors.sequence(function(){
            executors.sequence(function(){
                executors.sequence(function(){
                    run(1)
                    run(2)
                })
            })
        })
    })
}

describe('seq( seq( seq( seq( x, x ) ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f7, [ c.runner() ], function( ){
            c.dump().should.equal( r7 )
            done()
        })
    })
})



var r8 = '1? 2? 1 2'
function f8(run){
    executors.parallel(function(){
        executors.parallel(function(){
            executors.parallel(function(){
                executors.parallel(function(){
                    run(1)
                    run(2)
                })
            })
        })
    })
}

describe('par( par( par( par( x, x ) ) )', function(){
    it('should work', function( done ){
        var c = new Collector()
        run( f8, [ c.runner() ], function( ){
            c.dump().should.equal( r8 )
            done()
        })
    })
})



