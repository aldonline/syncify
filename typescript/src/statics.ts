///<reference path='../d/reactivity.d.ts'/>
import Cache        = require('./Cache')

var incomplete = false

export function informIncomplete( ){ incomplete = true }
export function resetIncomplete(){ incomplete = false }
export function getIncomplete(){ return incomplete }

export function getCurrentCache( ):Cache.Cache { return Cache.Cache.current( ) }