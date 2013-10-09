# Syncify

Pseudo-Blocking Async Javascript Functions

* Part of the [Radioactive UI Framework](http://github.com/aldonline/radioactive)
* [Reactivity.js](http://github.com/aldonline/reactivity) compatible

Installation via NPM

```shell
npm install syncify
```




# Problem

```javascript
// we have these two functions that go to the server
// and fetch some data
function getNameAsync( id, callback ){ ... }
function getLastnameAsync( id, callback ){ ... }

// we want to create a third function
function getFullNameAsync( id, callback ){ ... }

```

A naive attempt would be:
```javascript
function getFullNameAsync( id, callback ){ 
  return getNameAsync(id) + " " + getLastnameAsync(id)
}

```

Or maybe:

```javascript
function getFullNameAsync( id, callback ){ 
  callback(  getNameAsync(id) + " " + getLastnameAsync(id) )
}

```

But any normal programmer can come up with a working answer:

```javascript
function getFullNameAsync( id, callback ){ 
  getNameAsync( id, function(err, name){
    getLastnameAsync( id, function( err, lastname ){
      callback( name + " " + lastname )
    })
  })
}
```

Which is of course horrible, but still short compared to a more complete solution with 
proper error handling/propagation.

```javascript
function getFullNameAsync( id, callback ){ 
  getNameAsync( id, function(err, name){
    if ( err != null )
      return callback(err)
    getLastnameAsync( id, function( err, lastname ){
      if ( err != null )
        return callback(err)
      callback( name + " " + lastname )
    })
  })
}
```


# Solution

Syncify allows you to temporarily bring async functions into the sync world so you
can forget about...

```javascript

// transform async functions to their sync counterparts
var getName = syncify getNameAsync
var getLastname = syncify getLastnameAsync

function getFullName(id){
  return getName(id) + " " + getLastname(id)
}

// bring them back to the async world
var getFullNameAsync = syncify.revert getFullName

getFullNameAsync( "aldo", function(err, res){
  console.log( res ) // 'Aldo Bucchi'
})

```

# WARNING

* Functions must be idempotent
* Their arguments must be JSON serializable

# Usage


```coffeescript
syncify = require 'syncify'

# an async function
get_name_async = ( id, cb ) -> ...

# trasnsform to a blocking/sync function
get_name = syncify get_name_async

# do something using the sync function
f1 = ->
  # notice that we can call toUpperCase on the value
  # because this function now returns sychronously
  get_name( 8 ).toUpperCase()

# to execute the above function we need to unblock it
f1 = syncify.async f1

# and the function is async again
f1 (err, res) -> console.log err, res
```
