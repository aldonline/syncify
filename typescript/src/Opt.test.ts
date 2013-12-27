/// <reference path='../d/node.d.ts' />
/// <reference path='../d/mocha.d.ts' />
/// <reference path='../d/should.d.ts' />
/// <reference path='../d/reactivity.d.ts'/>

import assert     = require('assert')
import should     = require('should'); should;

import Opt        = require('./Opt')

describe( "Opt", () => {
  it("should store a value and retrieve it", () => {
    var opt1 = new Opt.Opt("a")
    opt1.get().should.equal("a")
  })
  
  it("get() should return undefined when empty()", () => {
    var opt1 = new Opt.Opt();
    ( typeof opt1.get( ) ).should.equal( 'undefined' )
  })
  
  it("get( strict ) should throw an error if empty", () => {
    var opt1 = new Opt.Opt();
    ( () => opt1.get( true ) ).should.throw()
  })
  
})