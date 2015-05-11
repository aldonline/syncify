**This project is no longer maintained. It has been [merged into Radioactive JS](https://github.com/radioactive/radioactive).**
---

# Syncify.js

Syncify is an innovative alternative to [Async.js](https://github.com/caolan/async), [Step](https://github.com/creationix/step) and [Node Fibers](https://github.com/laverdet/node-fibers). It allows you to deal with "Callback Hell" in a very simple way.

It works just like Node Fibers in that it ***completely eliminates the need for callbacks***. But, unlike Node Fibers, it also ***works on the browser!***


[![Syncify Intro Video](https://dl.dropboxusercontent.com/u/497895/__permalinks/syncify-youtube-screenshot.png)](http://www.youtube.com/watch?v=hvlBpWlpdFo)

* [Intro video](http://www.youtube.com/watch?v=hvlBpWlpdFo) ( 13 minutes )
* [Introductory article at Airpair](http://airpair.com/javascript/syncify-tutorial)


![Remove All The Callbacks](https://dl.dropboxusercontent.com/u/497895/donkeyscript/images/allmeme.png)

## Example

### Without Syncify


Assume that we have a very simple async function that issues an AJAX request to some remote REST API

```javascript
ajax( url, callback )
```

This would be a typical composite function that calls the ajax() service several times:

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
// 1. magically remove the callback from the ajax() service
ajax = syncify( ajax )

// 2. create a composite function. but this time without callbacks
function getFullName( id ){
	return ajax( "/user/" + id + "/name" ) + " " + ajax( "/user/" + id + "/lastname" )
}

// 3. add a callback to the resulting function so we can later use it
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

Or, same as above but using the function we had already defined

```javascript
function getFriendNames( id ){
	return ajax("/user/" + id + "/friends").map( getFullName )
}
```

You can literally do anything. ***Syncify allows you to escape from Callback Hell so you can continue coding in regular Javascript***.

## Limitations

Well. To be honest. You cannot do just **anything**. ***You cannot use Syncify to deal with functions that mutate application state***. That means you can exclusively use it with read-only functions.

If this sounds like a limitation to you then I suggest you stop and think about the following: If the portion of your code that mutates state depends on a set of mutually-dependent async calls your application may be open to race conditions. My personal recommendation is to avoid all async code within transactional operations unless you know what you are doing.

Syncify is designed to make your life easier when building UIs and reading data. And if you still want to write your business logic by composing async transactions ( at the expense of integrity ) then maybe [Async.js](https://github.com/caolan/async) is a better tool for the job.

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

The `syncify.parallel()` function is explained in [this video](http://www.youtube.com/watch?v=hvlBpWlpdFo).

## Quickstart

### Get the code

#### Using NPM

```shell
npm install syncify
```

#### Load Javascript on the browser

Syncify has no external dependencies. Just include it like you would any JS library:

```html
<script src="http://aldonline.github.io/syncify/build/syncify-1.1.0.min.js"/>
```

If you prefer you can find the .js and .min.js builds in the [/build](https://github.com/aldonline/syncify/tree/master/build) directory.


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



