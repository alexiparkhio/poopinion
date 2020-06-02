# Remake of [React Native AsyncStorage](https://github.com/react-native-community/async-storage) that manages key-value pairs in memory (it might be used for tests purposes)

## Installation

```sh
$ npm i not-async-storage
```

## Demo

```js
const AsyncStorage = require('not-async-storage')
const assert = require('assert')

assert(!!AsyncStorage, 'AsyncStorage exists')
assert(!!AsyncStorage.__context__, 'AsyncStorage.__context__ exists')

const key = 'hello', value = 'world'

    ; (async () => {
        await AsyncStorage.setItem(key, value)
            .then(() => assert.equal(AsyncStorage.__context__[key], value, `AsyncStorage.setItem sets the value '${value}' for the key '${key}' in the store`))
            .catch(console.error)
            .finally(() => delete AsyncStorage.__context__[key]) 

        AsyncStorage.__context__[key] = value
        AsyncStorage.__context__[key + 2] = value + 2
        await AsyncStorage.getItem(key)
            .then(_value => assert.equal(_value, value, `AsyncStorage.getItem returns the value '${value}' for the key '${key}' from the store`))
            .catch(console.error)
            .finally(() => delete AsyncStorage.__context__[key])

        AsyncStorage.__context__[key] = value
        AsyncStorage.__context__[key + 2] = value + 2
        await AsyncStorage.removeItem(key)
            .then(() => assert.equal(AsyncStorage.__context__[key], undefined, `AsyncStorage.removeItem removes value '${value}' for the key '${key}' from store`))
            .then(() => assert.equal(AsyncStorage.__context__[key + 2], value + 2, `AsyncStorage.removeItem removes value '${value + 2}' for the key '${key + 2}' from store`))
            .catch(console.error)

        AsyncStorage.__context__[key] = value
        AsyncStorage.__context__[key + 2] = value + 2
        await AsyncStorage.clear()
            .then(() => assert.equal(AsyncStorage.__context__[key], undefined, `AsyncStorage.removeItem removes value '${value}' for the key '${key}' from store`))
            .then(() => assert.equal(AsyncStorage.__context__[key + 2], undefined, `AsyncStorage.removeItem removes value '${value + 2}' for the key '${key + 2}' from store`))
            .catch(console.error)
    })()
        .catch(console.error)
```