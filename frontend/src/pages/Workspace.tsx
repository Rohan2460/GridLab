import { useState } from "react";

import CodeEditor from "../components/Editor";
import Terminal from "../components/Terminal";

import "./Workspace.css";

const initialCode = `
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`;

export default function App() {

    const [code, setCode] = useState(initialCode);

    return (
        <div className="app">

            <header className="header">GridLab</header>
            <main className="workspace">

                {/* ---------- Code editor ---------- */}
                <section className="editor-panel">
                    <div className="panel-header">main.c</div>

                    <CodeEditor
                        initialCode={initialCode}
                        onChange={setCode}
                    />
                </section>


                {/* ---------- Terminal ---------- */}
                <section className="terminal-panel">
                    <div className="panel-header">
                        Terminal
                    </div>

                    <Terminal />
                </section>

            </main>

            <footer className="footer">
                C | {code.length} characters
            </footer>

        </div>
    );
}