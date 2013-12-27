///<reference path='../d/reactivity.d.ts'/>
import util = require('./util')

var str = "PendingResultError"

// IMPORTANT: declare this before assigning to static class member
enum Status { Pending, Error, Ready };

class PendingResultError implements Error  {
  
  name = str ;
  message = str ;
  
  static status( error?: Error ): Status {
    return ( ! util.exists( error ) )? Status.Ready : ( error instanceof PendingResultError ) ? Status.Pending : Status.Error ;
  }

  static Status = Status
  
}

// Hack:
// typescript does not allow you to inherit from native classes ( for example Error )
// http://stackoverflow.com/questions/12915412/how-do-i-extend-a-host-object-e-g-error-in-typescript
// so instead of using Foo extends Bar we will set prototypal inheritance by hand
// we need this because we are using instanceof Error checks in several places
( <any> PendingResultError ).prototype = new Error()


export = PendingResultError