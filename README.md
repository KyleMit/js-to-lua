# JS To LUA

A guide to converting syntax from JS to LUA

## Architecture

* [microsoft/**monaco-editor**](https://github.com/Microsoft/monaco-editor)
* [fengari-lua/**fengari**](https://github.com/fengari-lua/fengari)
* [parcel-bundler/**parcel**](https://github.com/parcel-bundler/parcel)


## Getting Started

```bash
# run dev server
npm run dev
# run build
npm run build
```


## Todo

* [x] REPL Loop
  * "Run" Button
  * <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
  * <kbd>F5</kbd>
* [x] Remove items from context menu
* [ ] Capture print output in lua
* [ ] Add `inspect` library for lua -> convert output to JSON
* [ ] Resize containers and output height = contents + 1 line
  * resize on edit?
* [ ] resize monaco editor width for mobile layout
* [ ] Generate `index.html` from `index.md`
  * maybe use mdx?
  * option to include console on startup
  * makes authoring and contributing simple and clean
