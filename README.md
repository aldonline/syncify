# Syncify.js


Syncify is an innovative alternative to [Async.js](https://github.com/caolan/async), [Step](https://github.com/creationix/step) and [Node Fibers](https://github.com/laverdet/node-fibers). It allows you to deal with "Callback Hell" in a very simple way.

It works just like Node Fibers in that it ***completely eliminates the need for callbacks***. But, unlike Node Fibers, it also ***works on the browser!***

[![Syncify Intro Video](https://dl.dropboxusercontent.com/u/497895/__permalinks/syncify-youtube-screenshot.png)](http://www.youtube.com/watch?v=hvlBpWlpdFo)

* [Intro video](http://www.youtube.com/watch?v=hvlBpWlpdFo) ( 13 minutes )
* [Introductory article at Airpair](http://airpair.com/javascript/syncify-tutorial)


## Example

### Without Syncify
This is a typical composite function that calls an Ajax service several times:

```javascript
function getFullName( id, cb ){
  ajax( "/user/" + id + "/name", function( err, name ){
    if ( err ){
      cb( err );
    } else {
      ajax( "/user/" + id + "/lastname", function( err, lastname ){
        if ( err ){
          cb( err )
        } else {
          cb( null, name + " " + lastname )
        }
      })
    }
  })
}
```

Uff. That's a lot of nested callbacks. Let's see if we can do better.

### With Syncify

```javascript
// 1. syncify any async function you want to use
ajax = syncify( ajax )

// 2. you can now forget about callbacks when dealing with ajax()
function getFullName( id ){
	return ajax( "/user/" + id + "/name" ) + " " + ajax( "/user/" + id + "/lastname" )
}

// 3. unsyncify the resulting function
//    ( so that it takes a callback again )
getFullName = syncify.revert( getFullName )

```

Both functions ( the one with syncify and the one without syncify ) are equivalent. You can call them like this:

```javascript
getFullName( "aldo", function( err, res ){ console.log( res )})
```

Isn't that awesome?

Syncify allowed us to ***magically get rid of callbacks*** while creating a composite function.
It is not just cleaner, but it also allows us to ***take advantage of the full power of Javascript***.

You can use any function. For example:

```javascript
function getNameUC( id ){
	return ajax("/user/" + id + "/name").toUpperCase()
}
```

You can even process a collection using Array.map()!

```javascript
function getFriendNames( id ){
	return ajax("/user/" + id + "/friends").map( function( friend ){
		return ajax("/user/" + friend + "/name" ) + " " + ajax("/user/" + friend + "/lastname" )
  })
}
```

You can literally do anything. ***Syncify allows you to escape from Callback Hell so you can continue coding in regular Javascript***.

## Limitations

Well. To be honest. You cannot do just **anything**. ***You cannot use Syncify to deal with functions that mutate application state***. That means you can exclusively use it with read-only functions.

While this sounds like a limitation, in practice it is not. Syncify is much better at composing async queries ( functions that read ) while [Async.js](https://github.com/caolan/async) is better at composing business logic. You can combine them.

##

To compensate for this limitation, Syncify has grown some cool tricks. For example:

## Concurrency

You can make the above method much faster by using syncify.parallel:

```javascript
function getFriendNames( id ){
  var friends = ajax("/user/" + id + "/friends")
  syncify.parallel(function(){
    // all requests issued within this block will be parallelized
    friends.map(function(){
      return ajax("/user/" + id + "/name" ) + " " + ajax("/user/" + id + "/lastname" )
    })
  })
}
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


