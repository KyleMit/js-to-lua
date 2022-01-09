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

let nativeLog = console.log;

let options = {
  theme: "vs-dark",
  minimap: { enabled: false },
  lineNumbers: "off",
  scrollbar: { vertical: "auto", alwaysConsumeMouseWheel: false },
  scrollBeyondLastLine: false,
  //automaticLayout: true,
};

let sections = [...document.querySelectorAll(".code-section")];

sections.forEach((section) => {
  let containerJs = section.querySelector(".container-js");
  let containerLua = section.querySelector(".container-lua");

  let initEditor = (el) => {
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
      debugger;
      let value = ed.getValue();

      let output;

      if (isJs) {
        // capture console.log output

        console.log = function (val) {
          nativeLog(arguments);
          createConsole(arguments);
        };
        try {
          // if console.log is passively called, we need to hook into
          output = eval(value);
        } catch (error) {
          nativeLog("js eval error", { error, value });
          output = error;
        }

        console.log = nativeLog;
      } else {
        // todo: capture print() logs
        try {
          let fn = fengari.load(value);
          output = fn();
        } catch (error) {
          nativeLog("lua eval error", { error, value });
          output = error;
        }
      }

      if (output) createConsole(`${output}`);
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

    return {
      editor: monacoEditor,
      console: monacoConsole,
      editorDOM: editor,
      consoleDOM: console,
    };
  };

  let editorsJs = initEditor(containerJs);
  let editorsLua = initEditor(containerLua);

  // todo: resize all editors per container for consistent line heights

  let resizePair = (first, second, keepEvenHeight) => {
    // calc constants
    let paddingHeight = 10 + 2; // top + bottom
    let lineHeight =
      editorsJs.editor.getOption(monaco.editor.EditorOptions.lineHeight.id) ||
      19;

    // calc min / max based on line height
    let minHeight = 2 * lineHeight + paddingHeight;
    let maxHeight = 15 * lineHeight + paddingHeight;

    // calc editor heights
    let firstHeight = first.monaco.getContentHeight() + paddingHeight;
    let secondHeight = second.monaco.getContentHeight() + paddingHeight;

    // keep tallest value if we're keeping in sync
    if (keepEvenHeight) {
      firstHeight = Math.max(firstHeight, secondHeight);
      secondHeight = Math.max(firstHeight, secondHeight);
    }

    // clamp between min and max
    firstHeight = clamp(firstHeight, minHeight, maxHeight);
    secondHeight = clamp(secondHeight, minHeight, maxHeight);

    // first update element
    first.dom.style.height = `${firstHeight}px`;
    second.dom.style.height = `${secondHeight}px`;

    // then just re-layout editor
    first.monaco.layout();
    second.monaco.layout();
  };

  let resizeSection = () => {
    // update editors
    resizePair(
      { monaco: editorsJs.editor, dom: editorsJs.editorDOM },
      { monaco: editorsLua.editor, dom: editorsLua.editorDOM },
      window.innerWidth > 950 // mobile stack layout does not require height sync
    );

    // update consoles
    resizePair(
      { monaco: editorsJs.console, dom: editorsJs.consoleDOM },
      { monaco: editorsLua.console, dom: editorsLua.consoleDOM },
      false // consoles do not need even height
    );
  };

  editorsJs.editor.onDidChangeModelContent(resizeSection);
  editorsLua.editor.onDidChangeModelContent(resizeSection);

  // handle window resize event
  window.addEventListener("resize", resizeSection);

  // run on launch
  resizeSection();
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
