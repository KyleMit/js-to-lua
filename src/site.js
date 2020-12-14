import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import * as fengari from "fengari-web/dist/fengari-web.js";

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

  // get text
  let text = codeBlock.innerText;
  // remove innards
  el.removeChild(codeBlock);

  // create editor
  let monacoEditor = monaco.editor.create(editor, {
    value: text,
    language: language,

    ...options,
  });

  let value = monacoEditor.getValue();

  let createConsole = function (text) {
    // create output editor
    // wire up events to re-run output (Ctrl + Enter, F5, or Click Run ▶)
    monaco.editor.create(console, {
      readOnly: true,
      value: text,
      ...options,
    });
  };

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
});

// todo: resize all editors per container for consistent line heights
