import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export interface TerminalHandle {
    write: (data: string) => void;
    writeLine: (line?: string) => void;
    clear: () => void;
}

const Terminal = forwardRef<TerminalHandle>(function Terminal(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<XTerm | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            write: (data: string) => terminalRef.current?.write(data),
            writeLine: (line = "") => terminalRef.current?.writeln(line),
            clear: () => terminalRef.current?.reset(),
        }),
        [],
    );

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const terminal = new XTerm({
            cursorBlink: true,
            fontSize: 13,
            fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            theme: {
                background: "#0f172a",
                foreground: "#e2e8f0",
                cursor: "#93c5fd",
                selectionBackground: "#334155",
            },
        });

        terminal.open(containerRef.current);
        terminalRef.current = terminal;

        terminal.writeln("Welcome to GridLab!");
        terminal.writeln("Connected to sandbox workspace.");
        terminal.write("$ ");

        const input = terminal.onData((data) => {
            if (data === "\r") {
                terminal.write("\r\n$ ");
            } else if (data === "\u007f") {
                terminal.write("\b \b");
            } else {
                terminal.write(data);
            }
        });

        return () => {
            input.dispose();
            terminal.dispose();
            terminalRef.current = null;
        };
    }, []);

    return <div ref={containerRef} className="terminal-container" />;
});

export default Terminal;
