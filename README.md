# Syncify.js

In a nutshell, Syncify allows you to *temporarily bring asynchronous functions into the synchronous world* so you
can focus on solving your problem using clean, imperative code. Here's a quick example of what Syncify can do for you:

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
var  getFriendIds = syncify( getFriendIdsFromServer )
var  getFirstName = syncify(  getFirstNameFromServer )
var  getLastName  = syncify(  getLastNameFromServer )

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
var getFriendNamesFromServer = syncify.async( getFriendNames )

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

Take a look at the `/build` folder

# Caveats

* Functions must be idempotent
* Their arguments must be JSON serializable

