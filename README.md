# Blocking.js
Pseudo-Blocking Async Javascript Functions

* Part of the Radioactive Framework
* [Notifying.js](http://github.com/aldonline/notifying.js) compatible

Installation via NPM

    npm install blocking

Quickstart

    blocking = require 'blocking'
    
    # an async function
    get_name_async = ( id, cb ) -> ...
    
    # trasnsform to a blocking/sync function
    get_name = blocking get_name_async
    
    # do something using the sync function
    f1 = ->
      # notice that we can call toUpperCase on the value
      # because this function now returns sychronously
      get_name( 8 ).toUpperCase()
    
    # to execute the above function we need to unblock it
    f1 = blocking.unblock f1
    
    # and the function is async again
    f1 (err, res) -> console.log err, res
    
    
    
    


