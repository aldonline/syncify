///<reference path='../d/reactivity.d.ts'/>
import reactivity  = require('reactivity')
import PRE         = require('./PendingResultError')

class Invocation {
  private cell = reactivity()

  constructor( public f: ( ...args: any[] ) => void , public args: any[] ) {
      this.refresh( )
  }
  
  refresh(){
      this.cell( new PRE() )
      var args2 = this.args.concat( [ (e,r) => {
              if ( e ){ this.cell( e ) } else { this.cell( r ) }
          }])
      this.f.apply( null, args2 )
  }
  
  // reactive function
  // may return a result or throw a PRE
  getResult = () => this.cell( )
}

export = Invocation