# JS to LUA


---

## Functions

Lua uses `keyword...end` blocks instead of `{}`.

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

## Comments

```js
// single line comment
/*
    multiline comment
*/
```


```lua
-- single line comment
--[[
    multiline comment
--]]
```

---



## do .. while

```js
do {
    // some code
} while (condition)
```

```lua
repeat
    -- some code
until not condition
```


---

## Variable

All local variables in lua use `local` instead of `var`, `let`, or `const`.

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


## Equality

```js
let bool1 = "0" === 0 // false
let bool2 = "0" == 0  // true
```

```lua
local bool1 = "0" == 0            -- false
local bool2 = "0" == tostring(0)  -- true
```

---

## Negation Operator

```js
let isNotFrance = country != "france"
```

```lua
local isNotFrance = country ~= "france"
```


---

## Ternary

```js
let name = condition ? "A" : "B"
```

```lua
local name = condition and "A" or "B"

-- safer
if condition then
    name = "A"
else
    name = "B"
end
```


---

## Null-Coalescing Operator

```js
let message = error.message ?? 'An unknown error occurred.';
let message = error.message ? error.message : 'An unknown error occurred.';
```

```lua
local message = error.message or 'An unknown error occurred.';
```


---


## Multiple Expressions

```js
const variable = (someExpression1, someExpression2, ..., someExpressionN)
```

```lua
local variable = (function()
    someExpression1
    someExpression2
    ...
    return someExpressionN
end)()
```

---


## Unicode

Lua only supports up to UTF-8

JS has [`String.fromCharCode()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)

```js
let a1 = "a"
let a2 = "\u{061}"
let a3 = "\u0061"
let a4 = String.fromCharCode(0x61) // hex
let a5 = String.fromCharCode(97)   // dec
```


```lua
local a1 = "a"
local a2 = "\u{061}"
local a3 = "\097"
local a4 = string.char(0x61) -- hex
local a5 = string.char(97)   -- dec
local a6 = utf8.char(0x61)   -- hex
local a7 = utf8.char(97)     -- dec
```

---

## Further Reading

* [Learning Lua from JavaScript](http://phrogz.net/lua/LearningLua_FromJS.html)
* [Lua vs Javascript - MediaWiki](https://www.mediawiki.org/wiki/User:Sumanah/Lua_vs_Javascript)
* [Subtle differences between JavaScript and Lua](https://stackoverflow.com/q/1022560/1366033)
