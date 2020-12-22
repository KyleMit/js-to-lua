import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as fengari from "fengari-web/dist/fengari-web.js";
import * as actions from "monaco-editor/esm/vs/platform/actions/common/actions";

(function removeContextMenuItems() {
  let contextMenuEntry = [...actions.MenuRegistry._menuItems].find(
    (entry) => entry[0]._debugName == "EditorContext"
  );
  let contextMenuLinks = contextMenuEntry[1];

  let keepableIds = [
    "editor.action.clipboardCutAction",
    "editor.action.clipboardCopyAction",
    "editor.action.clipboardPasteAction",
  ];

  let linkedListToArray = (list) => {
    let arr = [];
    let node = list._first;
    while (node.element) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  };

  let removableNodes = linkedListToArray(contextMenuLinks).filter((node) => {
    return !keepableIds.includes(node.element?.command?.id);
  });

  removableNodes.forEach((node) => {
    contextMenuLinks._remove(node);
  });
})();

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "json") {
      return "./json.worker.js";
    }
    if (label === "css") {
      return "./css.worker.js";
    }
    if (label === "html") {
      return "./html.worker.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.js";
    }
    return "./editor.worker.js";
  },
};

let options = {
  theme: "vs-dark",
  minimap: { enabled: false },
  lineNumbers: "off",
  scrollbar: { vertical: "auto" },
  scrollBeyondLastLine: false,
  //automaticLayout: true,
};

let containers = [...document.querySelectorAll(".container")];
containers.forEach((el) => {
  // get language
  let isJs = el.classList.contains("container-js");
  let language = isJs ? "javascript" : "lua";

  // get code block
  let codeBlock = el.querySelector("pre");
  let editor = el.querySelector(".editor");
  let console = el.querySelector(".console");
  let playBtn = el.querySelector(".play");

  // get text
  let text = codeBlock.innerText;
  // remove innards
  el.removeChild(codeBlock);

  // create editor
  let monacoEditor = monaco.editor.create(editor, {
    ...options,
    value: text,
    language: language,
  });

  // create console
  let monacoConsole = monaco.editor.create(console, {
    ...options,
    readOnly: true,
    value: "",
  });

  playBtn.addEventListener("click", () => {
    runRepl(monacoEditor);
  });

  //let value = monacoEditor.getValue();

  let createConsole = function (text) {
    // create output editor
    // wire up events to re-run output (Ctrl + Enter, F5, or Click Run ▶)
    monacoConsole.setValue(text);
    // check if we already exist - if so, just update value
  };

  let runRepl = (ed) => {
    let value = ed.getValue();

    if (isJs) {
      // capture console.log output
      console.log = function (val) {
        //createConsole(val);
      };
      let out = eval(value);
      if (out) createConsole(out);
    } else {
      // todo: capture print() logs
      let fn = fengari.load(value);
      let out = fn();
      if (out) createConsole(out);
    }
  };

  monacoEditor.addAction({
    id: "run-repl",
    label: "Run",
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1,
    keybindings: [
      monaco.KeyCode.F5,
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    ],
    run: runRepl,
  });

  runRepl(monacoEditor);
});

// todo: resize all editors per container for consistent line heights
