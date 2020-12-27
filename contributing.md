# Contributing

## Content

To add language examples to document - add them to the `index.md` file at the project root directory.

Sections must follow the following format:

~~~md
---

## Section Title

Section content w/ **Markdown**

```js
// js code block
```

```lua
-- lua code block
```

---
~~~

According to the following rules:

1. Sections must be separated by a `<hr>` using three dashes `---`
2. Should start with a `<h2>` section title using two hash symbols `##`
3. Can add any markdown content you like between the section title and first code block
4. Code blocks should be fenced code blocks with language tags for `js` or `lua`

