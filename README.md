
<p align="center">
  <img src="https://avatars1.githubusercontent.com/u/42543587?s=200&v=4" alt="Fiery Data">  
</p>

<p align="center">
<img src="https://img.shields.io/npm/v/fiery-vue.svg">
<img src="https://img.shields.io/npm/l/fiery-vue.svg">
<img src="https://travis-ci.org/fiery-data/fiery-vue.svg?branch=master">
</p>

## fiery-vue

Vue.js binding for Google Firebase Cloud Firestore.

Relies on [fiery-data](https://github.com/fiery-data/fiery-data) - you can go there to see more advanced examples

#### Features
- Documents [example](#documents)
- Collections (stored as array or map) [example](#collections)
- Queries (stored as array or map) [example](#queries)
- Streams (stored as array or map) [example](#streams)
- Pagination [example](#pagination)
- Real-time or once [example](#real-time-or-once)
- Data or computed properties [example](#data-or-computed)
- Adding, updating, sync, removing, remove field [example](#adding-updating-overwriting-removing)
- Sub-collections (with cascading deletions!) [example](#sub-collections)
- Return instances of a class [example](#return-instances-of-a-class)
- Add active record methods (sync, update, remove, clear, getChanges) [example](#active-record)
- Control over what properties are sent on save [example](#save-fields)
- Encode & decode properties [example](#encode--decode-properties)
- Adding the key and exists to the document [example](#adding-key-and-exists-to-object)
- Sharing, extending, defining, and global options [example](#sharing-extending-defining-and-global-options)
- Callbacks (error, success, missing, remove) [example](#callbacks)
- Custom binding / unbinding [example](#binding-and-unbinding)

**Contents**
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)

### Dependencies

- fiery-data: ^0.0.7
- Firebase ^5.0.0 (a runtime dependency only, since you are passing the references)
- Vue: ^1.0.28 (not an actual dependency, since you are calling `Vue.use` yourself)

### Installation

#### npm

Installation via npm : `npm install --save fiery-vue`

### Usage

```javascript
import Vue from 'vue'
import FieryVue from 'fiery-vue'
import firebase from 'firebase'

require('firebase/firestore')

Vue.use(FieryVue)

const app = firebase.initializeApp({ ... })
const fs = firebase.firestore(app);

new Vue({
  el: '#app',
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos')) // live collection,
      ford: this.$fiery(fs.collection('cars').doc('ford')), // live document
      role: 'admin'
    }
  },
  computed: {
    // Updated when role changes
    personsWithRole() {
      const { role } = this
      const options = {
        query: q => q.where('role', '==', role),
        type: Person
      }
      return this.$fiery(fs.collection('persons'), options, 'personsWithRole')
    }
  }
})
```

Each object will contain a `.uid` property. This helps identify what firestore
database the document is stored in, the collection, and with which options.

```json
{
  ".uid": "1///1///todos/-Jtjl482BaXBCI7brMT8",
  "name": "Star fiery-vue",
  "done": true
}
```

### Documents

```javascript
new Vue({
  inject: ['currentUserId'],
  fiery: true, // required to add this.$fiery to this component
  data() {
    const $fiery = this.$fiery
    return {
      settings: $fiery(fs.collection('settings').doc('system')),
      currentUser: $fiery(fs.collection('users').doc(this.currentUserId)) // not reactive, but is updated real-time
    }
  }
})
```

### Collections

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    const $fiery = this.$fiery
    return {
      cars: $fiery(fs.collection('cars')) // real-time array
      carMap: $fiery(fs.collection('cars'), {map: true}) // real-time map: carMap[id] = car
    }
  }
})
```

### Queries

```javascript
new Vue({
  inject: ['currentUserId'],
  fiery: true, // required to add this.$fiery to this component
  data() {
    const $fiery = this.$fiery
    return {
      currentCars: $fiery(fs.collection('cars'), { // real-time array
        query: (cars) => cars.where('created_by', '==', this.currentUserId)
      })
      currentCarMap: $fiery(fs.collection('cars'), { // real-time map: currentCarMap[id] = car
        query: (cars) => cars.where('created_by', '==', this.currentUserId),
        map: true
      })
    }
  }
})
```

### Streams

A stream is an ordered collection of documents where the first N are fetched, and any newly created/updated documents that should be placed in the collection
are added. You can look back further in the stream using `more`. A use case for
streams are a message channel. When the stream is first loaded N documents are
read. As new messages are created they are added to the beginning of the collection. If the user wishes to see older messages they simply have to call
`more` on the stream to load M more.  The `once` property does not work on streams, they are real-time only.

You MUST have an orderBy clause on the query option and `stream` must be `true`.

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    const $fiery = this.$fiery
    return {
      // streams are always real-time, but can be an array or map
      messages: $fiery(
        fs.collection('messages'), {
        query: q => q.orderBy('created_at', 'desc'),
        stream: true,
        streamInitial: 25, // initial number of documents to load
        streamMore: 10 // documents to load when more is called without a count
      })
    }
  },
  methods: {
    loadMore() {
      // load 10 more
      this.$fiery.more(this.messages)
    },
    loadManyMore() {
      // load count more
      $fiery.more(messages, 100)
    }
  }
})
```

### Pagination

```javascript
new Vue({
  data() {
    return {
      make: 'Honda',
      limit: 10
    }
  },
  computed: {
    carsOptions() {
      const { make, limit } = this // we have to reference these here for this to work
      return {
         query: cars => cars.where('make', '==', make).orderBy('created_at').limit(limit),
         // required for prev() - orderBy's must be in reverse
         queryReverse: cars => cars.where('make', '==', make).orderBy('created_at', 'desc').limit(limit)
      }
    },
    cars() {
      return this.$fiery(fs.collection('cars'), this.carsOptions, 'cars')
    },
    carsPager() {
      return this.$fiery.pager(this.cars)
    }
  },
  methods: {
    next() {
      this.carsPager.next() // next 10 please, returns a promise which resolves when they're fetched

      // this.carsPager.index // which page we're on
      // this.carsPager.hasNext() // typically returns true since we don't really know - unless cars is empty
      // this.carsPager.next() // executes the query again but on the next 10 results. index++
      // this.carsPager.hasPrev() // looks at pager.index to determines if there's a previous page
      // this.carsPager.prev() // executes the query again but on the previous 10 results. index--
    }
  }
})
```

### Real-time or once

```javascript
new Vue({
  inject: ['currentUserId'],
  fiery: true, // required to add this.$fiery to this component
  data() {
    const $fiery = this.$fiery
    return {
      // real-time is default, all you need to do is specify once: true to disable it
      cars: $fiery(fs.collection('cars'), {once: true}), // array populated once
      currentUser: $fiery(fs.collection('users').doc(this.currentUserId), {once: true}), // current user populated once
    }
  }
})
```

### Data or computed

For computed properties the third parameter to `$fiery` is required (it's best to just use the name of the property)

```javascript
new Vue({
  inject: ['currentUserId'],
  fiery: true, // required to add this.$fiery to this component
  data() {
    // data examples above
    return {
      limit: 25,
      status: 'unfinished'
    }
  },
  computed: {
    currentUser() {
      const { currentUserId } = this;
      const options = {}
      return this.$fiery(fs.collection('users').doc(currentUserId), options, 'currentUser') // reactive and real-time
    },
    todos() {
      // For computed results you need to get the dependent variables early so they are properly tracked.
      // The query/queryReversed callback may not be called immediately, so they must be pulled out.
      const { currentUserId, status, limit } = this;
      const options = {
        query: todos => todos
          .where('created_by', '==', currentUserId)
          .where('status', '==', status)
          .limit(limit)
      }
      return this.$fiery(fs.collection('todos'), options, 'todos') // reactive and real-time
    }
  }
})
```

### Adding, updating, overwriting, removing

```javascript
new Vue({
  inject: ['currentUserId'],
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'))
    }
  },
  computed: {
    currentUser() {
      const { currentUserId } = this;
      return this.$fiery(fs.collection('users').doc(currentUserId), {}, 'currentUser')
    }
  },
  methods: {
    addTodo() { // COLLECTIONS STORED IN $fires
      this.$fires.todos.add({
        name: 'Like fiery-vue',
        done: true
      })
      // OR
      const savedTodo = this.$fiery.create(this.todos, { // you can pass this.todos or 'todos'
        name: 'Love fiery-vue',
        done: false
      })
    },
    updateUser() {
      this.$fiery.update(this.currentUser)
    },
    updateUserEmailOnly() {
      this.$fiery.update(this.currentUser, ['email'])
    },
    updateAny(data) { // any document can be passed, ex: this.todos[1], this.currentUser
      this.$fiery.update(data)
    },
    overwrite(data) { // only fields present on data will exist on sync
      this.$fiery.sync(data)
    },
    remove(data) {
      this.$fiery.remove(data) // removes sub collections as well
      this.$fiery.remove(data, true) // preserves sub collections
    },
    removeName(todo) {
      this.$fiery.clear(data, 'name') // can also specify an array of props or sub collections
    }
  }
})
```

### Sub-collections

You can pass the same options to sub, nesting as deep as you want!

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      // this.todos[todoIndex].children[childIndex]
      todos: this.$fiery(fs.collection('todos'), {
        sub: {
          children: { // creates an array or map on each todo object: todo.children[]
            // once, map, etc
            query: children => children.orderBy('updated_at')
          }
        }
      })
    }
  },
  methods: {
    addChild(parent) {
      this.$fiery.ref(parent).collection('children').add( { /* values */ } )
      // OR
      this.$fiery.ref(parent, 'children').add( { /* values */ } )
      // OR
      const savedChild = this.$fiery.createSub(parent, 'children', { /* values */ } )
      // OR
      const unsavedChild = this.$fiery.buildSub(parent, 'children', { /* values */ } )
    },
    clearChildren(parent) {
      this.$fiery.clear(parent, 'children') // clear the sub collection
    }
  }
})
```

### Return instances of a class

```javascript
function Todo() {

}
Todo.prototype = {
  markDone (byUser) {
    this.done = true
    this.updated_at = Date.now()
    this.updated_by = byUser.id
  }
}

new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      // this.todos[todoIndex] instanceof Todo
      todos: this.$fiery(fs.collection('todos'), {
        type: Todo,
        // OR you can specify newDocument and do custom loading (useful for polymorphic data)
        newDocument: function(initialData) {
          var instance = new Todo()
          instance.callSomeMethod()
          return instance
        }
      })
    }
  }
})
```

### Active Record

```javascript
// can be used with type, doesn't have to be
function Todo() {

}
Todo.prototype = {
  markDone (byUser) {
    this.done = true
    this.updated_at = Date.now()
    this.updated_by = byUser.id
    this.$update() // injected
  }
}

new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'), {
        type: Todo,
        record: true
        // $sync, $update, $remove, $ref, $clear, $getChanges, $build, $create are functions added to every Todo instance
      }),
      todosCustom: this.$fiery(fs.collection('todos'), {
        record: true,
        recordOptions: { // which methods do you want added to every object, and with what method names?
          sync: 'sync',
          update: 'save',
          remove: 'destroy'
          // we don't want $ref, $clear, or $getChanges
        }
      })
    }
  },
  methods: {
    updateTodoAt(index) {
      // same as this.$fiery.update(this.todos[index])
      this.todos[index].$update()
    },
    saveTodoCustomAt(index) {
      // same as this.$fiery.update(this.todosCustom[index])
      this.todosCustom[index].save()
    },
    done(todo) {
      todo.markDone(this.currentUser) // assuming currentUser exists
    },
    getChanges(todo) {
      // exclude array to compare entire document
      todo.$getChanges(['name', 'done']).then((changes) => {
        // changes.changed, changes.remote, changes.local
      })
    }
  }
})
```

### Save fields

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'), {
        include: ['name', 'done'], // if specified, we ONLY send these fields on sync/update
        exclude: ['hidden'] // if specified here, will not be sent on sync/update
      }),
    }
  },
  methods: {
    save(todo) {
      this.$fiery.update(todo) // sends name and done as configured above
    },
    saveDone(todo) {
      this.$fiery.update(todo, ['done']) // only send this value if it exists
    },
    saveOverride(todo) {
      this.$fiery.update(todo, ['hidden']) // ignores exclude and include when specified
    }
  }
})
```

### Encode & decode properties

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'), {
        // convert server values to local values
        decoders: {
          status(remoteValue, remoteData) {
            return remoteValue === 1 ? 'done' : (remoteValue === 2 ? 'started' : 'not started')
          }
        },
        // convert local values to server values
        encoders: {
          status(localValue, localData) {
            return localValue === 'done' ? 1 : (localeValue === 'started' ? 2 : 0)
          }
        },
        // optionally instead of individual decoders you can specify a function
        decode(remoteData) {
          // do some decoding, maybe do something special
          return remoteData
        }
      })
    }
  }
})
```

### Adding key and exists to object

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'), {key: 'id', propExists: 'exists', exclude: ['id', 'exists']}) // must be excluded manually from saving if include is not specified
    }
  },
  methods: {
    log(todo) {
      // todo.id exists now
      console.log(todo)
    }
  }
})
```

### Sharing, extending, defining, and global options

```javascript
// ==== Sharing ====
let Todo = {
  shared: true, // necessary for non-global or defined options that are used multiple times
  include: ['name', 'done', 'done_at']
}

// ==== Extending ====
let TodoWithChildren = {
  shared: true
  extends: Todo,
  sub: {
    children: Todo
  }
}

// ==== Defining ====
FieryVue.define('post', {
  // shared is not necessary here
  include: ['title', 'content', 'tags']
})

// or multiple
FieryVue.define({
  comment: {
    include: ['author', 'content', 'posted_at', 'status'],
    sub: {
      replies: 'comment' // we can reference options by name now, even circularly
    }
  },
  images: {
    include: ['url', 'tags', 'updated_at', 'title']
  }
})

// ==== Global ====
FieryVue.setGlobalOptions({
  // lets make everything active record
  record: true,
  recordOptions: {
    update: 'save',         // object.save(fields?)
    sync: 'sync',           // object.sync(fields?)
    remove: 'remove',       // object.remove()
    clear: 'clear',         // object.clear(fields)
    create: 'create',       // object.create(sub, initial?)
    build: 'build',         // object.build(sub, initial?)
    ref: 'doc',             // object.doc().collection('subcollection')
    getChanges: 'changes'   // object.changes((changes, remote, local) => {})
  }
})

new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      comments: this.$fiery(fs.collection('comment'), 'comment') // you can pass a named or Shared
    }
  }
})
```

### Callbacks

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  data() {
    return {
      todos: this.$fiery(fs.collection('todos'), {
        onSuccess: (todos) => {},
        onError: (message) => {},
        onRemove: () => {},
        onMissing: () => {} // occurs for documents
      })
    }
  }
})
```

### Binding and Unbinding

```javascript
new Vue({
  fiery: true, // required to add this.$fiery to this component
  methods: {
    bindTodos() {
      this.todos = this.$fiery(fs.collection('todos'))
    },
    unbindTodos() {
      this.$fiery.free(this.todos)
    }
  }
})
```

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
