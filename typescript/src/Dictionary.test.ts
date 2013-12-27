/// <reference path='../d/node.d.ts' />
/// <reference path='../d/mocha.d.ts' />
/// <reference path='../d/should.d.ts' />
/// <reference path='../d/reactivity.d.ts'/>

import assert     = require('assert')
import should     = require('should'); should;

import Dictionary = require('./Dictionary')

describe( "Dictionary", () => {
  it("should have no keys ", () => {
    var d = new Dictionary.Dictionary<String>()
    d.opt('d').empty().should.equal( true )
    d.set('d', 'v')
    d.opt('d').empty().should.equal( false )
  })
})