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
import PRE        = require('./PendingResultError')

describe('PendingResultError', function(){
    it('should work OK with reactivity.Cells', function(){
        var cell = reactivity()
        var pre = new PRE()
        cell( pre )
        cell.should.throw()
    })
})


describe('PendingResultError.Status', function(){
    it('should correctly detect status', function(){
        PRE.status( new PRE   ).should.equal( PRE.Status.Pending )
        PRE.status( new Error ).should.equal( PRE.Status.Error )
        PRE.status( undefined ).should.equal( PRE.Status.Ready )        
    })
})