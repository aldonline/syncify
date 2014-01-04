# Syncify.js

In a nutshell, Syncify allows you to *temporarily bring asynchronous functions into the synchronous world* so you
can focus on solving your problem using clean, imperative code.
Syncify does *not use Node Fibers* and **runs on any Javascript environment including the browser**.


[![Syncify Intro Video](https://dl.dropboxusercontent.com/u/497895/__permalinks/syncify-youtube-screenshot.png)](http://www.youtube.com/watch?v=hvlBpWlpdFo)

* [Intro video](http://www.youtube.com/watch?v=hvlBpWlpdFo) ( 13 minutes )
* [Introductory article at Airpair](http://airpair.com/javascript/syncify-tutorial)


Here's a quick example of what Syncify can do for you:

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
var  getFirstName = syncify( getFirstNameFromServer )
var  getLastName  = syncify( getLastNameFromServer )

// and we can now combine them using clean, synchronous imperative code
function getFullName( id ){
  return getFirstName( id ) + " " + getLastName( id )
}

function getFriendNames( id ){
  return getFriendIds( id ).map( getFullName )
}

// now that we have our combined function
// we bring it back to the async world
var getFriendNamesFromServer = syncify.revert( getFriendNames )

// voila!
// we created a composite async function
// without visiting callback hell
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

**WE NEED MORE STARS ON THIS PROJECT TO GET IT INTO CDNJS!! CLICK "STAR" ABOVE**

You can find ready to use .js and .min.js files in the [/build](https://github.com/aldonline/syncify/tree/master/build) directory.


# API

### syncify( asyncFunc: Function ): Function

Takes an async function and returns a syncified version

### syncify.revert( syncifiedFunc: Function ): Function

Takes a syncified function ( or a function that contains nested syncified functions ) and returns an equivalent async function ( one that takes a callback ). This function is the counterpart/opposite of `syncify()`.

### syncify.parallel( block:Function )

See video ( top of the page )

### syncify.sequence( block:Function )

See video ( top of the page )


# Caveats

* Functions must be idempotent
* Their arguments must be JSON serializable
* There are a few known bugs ( see [issue #18](https://github.com/aldonline/syncify/issues/18) ). But other than that the code has been used in a dozen apps in production for over 4 months.

# How does it work?

I will dig deep into this when I find the time. For now you can find more info on the [article at AirPair](http://airpair.com/javascript/syncify-tutorial).

This module uses [Native Reactivity](https://github.com/aldonline/reactivity) under the covers. This means you can combine it transparently with other Native Reactivity libraries. ( TODO: links ).


