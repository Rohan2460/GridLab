import "vite/modulepreload-polyfill";
import "@xterm/xterm/css/xterm.css";

import { createEditor } from "./editor.js";
import { createTerminal } from "./terminal.js";

const editor = createEditor(
    document.getElementById("editor")
);

const terminal = createTerminal(
    document.getElementById("terminal")
);

document.getElementById("language").addEventListener(
    "change",
    (event) => editor.setLanguage(event.target.value)
);

// Temporary test output
terminal.terminal.writeln("Terminal ready.");
terminal.terminal.write("$ ");