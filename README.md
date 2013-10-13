# Syncify

Pseudo-Blocking Async Javascript Functions

* Part of the [Radioactive UI Framework](http://github.com/aldonline/radioactive)
* [Reactivity.js](http://github.com/aldonline/reactivity) compatible

Installation via NPM

```shell
npm install syncify
```




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

Now. There are many libraries that deal with this ( async comes to mind ).

But Syncify takes a radically different approach:

# The Syncify Way

In a nutshell, Syncify allows you to temporarily bring async functions into the sync world so you
can completely forget about asynchronicity and focus on solving your problem using clean imperative code.

This is how you would go about solving the problem using the Syncify way.

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

