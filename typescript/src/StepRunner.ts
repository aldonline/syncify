/// <reference path='../d/reactivity.d.ts'/>
class StepRunner {
  lines: { time:number ; func:()=>void }[] = []
  constructor( public endCallback:()=>void ){}
  add( time:number, func: ()=> void ){
    this.lines.push( { time:time, func:func } )
  }
  start(){
    var lines = this.lines.concat()
    var initial = Date.now()
    var iter = () => {
      var next = lines[0]
      if ( next ){
        var elapsed = Date.now() - initial
        if ( elapsed >= next.time ){
          next.func()
          lines.shift()
        }
      }
      // keep on looping
      if ( lines.length > 0 ){
        setTimeout( iter, 5 )
      } else {
        this.endCallback()
      }
    }
    iter()
  }
}

export = StepRunner