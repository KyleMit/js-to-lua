# JS to LUA


---

## Functions

Lua uses `keyword...end` blocks instead of `{}`

```js
function sayHello(name) {
    return name
}

sayHello("gan")
```

```lua
function sayHello(name)
    return name
end

return sayHello("gus")
```

---


## Variable

All local variables in lua use

```js
var a = 1
let b = 2
const c = 3
d = 4 // global
```

```lua
local a = 1
local b = 2
local c = 3
d = 4 -- global
```

---

## Further Reading

* [Learning Lua from JavaScript](http://phrogz.net/lua/LearningLua_FromJS.html)
* [Lua vs Javascript - MediaWiki](https://www.mediawiki.org/wiki/User:Sumanah/Lua_vs_Javascript)
* [Subtle differences between JavaScript and Lua](https://stackoverflow.com/q/1022560/1366033)

---
