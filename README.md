# Blocking.js
Pseudo-Blocking Async Javascript Functions

Installation via NPM

    npm install blocking

Quickstart

    blocking = require 'blocking'
    
    # create an async function that calls the server
    get_name_async = ( id, cb ) -> ...
    
    # trasnsform to a bocking function
    get_name_sync = blocking get_name_async
    
    # do something using the sync function
    f1 = ->
      # notice that we can call toUpperCase on the value
      # because this function now returns sychronously
      get_name_sync( 8 ).toUpperCase()
    
    # to execute the above function we need to unblock it
    f1 = blocking.unblock f1
    
    # and the function is not async again
    f1 (err, res) -> console.log err, res
    
    
    
    


