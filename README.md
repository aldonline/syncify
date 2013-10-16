# Syncify

In a nutshell, Syncify allows you to *temporarily bring asynchronous functions into the synchronous world* so you
can focus on solving your problem using clean, imperative code. Here's a quick example of what it looks like:

```javascript

// we have three async functions that go to the server and fetch some data
function getFriendIdsFromServer( id, cb ){ ... }
function getFirstNameFromServer( id, cb ){ ... }
function getLastNameFromServer( id, cb ){ ... }

// we want to create a function that combines them all
function getFriendNamesFromServer( cb ){ ... }

// we don't want to work with callbacks
// so we "syncify" these async functions
// ( we temporarily bring them to the sync world using black magic )
var  getFriendIds = syncify getFriendIdsFromServer
var  getFirstName = syncify getFirstNameFromServer
var  getLastName  = syncify getLastNameFromServer

// and we can now combine them using clean, synchronous imperative code
function getFriendNames( id, cb ){
  var names = [];
  var friendIds = getFriendIds( id );
  for ( var i=0; i<friendIds.length; i++ ){
    var id = friendIds[i];
    // look mom. no callbacks!
    names.push( getFirstName( id ) + " " + getLastName( id ) );
  }
  return names;
}

// now that we have our combined function
// we need to bring it back to the async world
// in order to call it
var getFriendNamesFromServer = syncify.async getFriendNames

// voila!
// we can call our combined function
getFriendNamesFromServer( 78, function( err, names ){
  console.log( names.join( ", " ) );
})


```


## Quickstart

### Get the code

#### Using NPM

```shell
npm install syncify
```

#### Load Javascript on the browser

This library depends on reactivity.js

TODO... JS Bundle coming up soon.

### Use it

# Problem

We have these two functions that go to the server and fetch some data

```javascript
function getNameAsync( id, callback ){ ... }
function getLastnameAsync( id, callback ){ ... }
```

We want to create a third function that combines them

```javascript
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

But of course those won't work. Because async functions are a b**ch.
You'd have to do something like this.

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
    if ( err != null ) {
      return callback(err)
    }
    getLastnameAsync( id, function( err, lastname ){
      if ( err != null) {
        return callback(err)
      }
      callback( name + " " + lastname )
    })
  })
}
```

Now. There are many libraries that deal with this ( [async](https://github.com/caolan/async) comes to mind ).

But Syncify takes a radically different approach:

# The Syncify Way

In a nutshell, Syncify allows you to *temporarily bring asynchronous functions into the synchronous world* so you
can focus on solving your problem using clean, imperative code.

This is how you would go about solving the problem "the Syncify way".

```javascript

// transform async functions to their sync counterparts
var getName = syncify getNameAsync
var getLastname = syncify getLastnameAsync

function getFullName(id){
  return getName(id) + " " + getLastname(id)
}

// bring them back to the async world
var getFullNameAsync = syncify.revert getFullName

// you can now use them as if they were synchronous
getFullNameAsync( "aldo", function(err, res){
  console.log( res ) // 'Aldo Bucchi'
})

```

That's all there is to it.

# Caveats

* Functions must be idempotent
* Their arguments must be JSON serializable

