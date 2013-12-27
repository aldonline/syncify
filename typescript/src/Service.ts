///<reference path='../d/reactivity.d.ts'/>
import types        = require('./types')
import util         = require('./util')
import Invocation   = require('./Invocation')
import statics      = require('./statics')

export class Service {
    id: number = util.serial( )
    constructor(
        public f:( ...args: any[] ) => void,
        public hasher: types.Hasher = JSON.stringify
        ){ }
    runDirectly   = ( args: any[] ) => new Invocation( this.f, args )
    runWithCache  = ( args: any[] ) => statics.getCurrentCache( ).getOrCreate( this ).run( args )
}