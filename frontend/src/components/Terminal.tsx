import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {

    // Reference to the HTML element
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!terminalRef.current) return;

        // Create terminal
        const terminal = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            theme: {
                background: "#111827",
                foreground: "#E5E7EB"
            }
        });

        // Attach terminal to the HTML element
        terminal.open(terminalRef.current);

        // Display some initial text
        terminal.writeln("Welcome to GridLab!");
        terminal.write("$ ");

        // Receive keyboard input
        const input = terminal.onData((data) => {

            if (data === "\r") {
                terminal.write("\r\n$ ");
            }
            else if (data === "\u007f") {
                terminal.write("\b \b");
            }
            else {
                terminal.write(data);
            }

        });

        // Cleanup
        return () => {
            input.dispose();
            terminal.dispose();
        };

    }, []);

    return (
        <div ref={terminalRef} className="terminal-container" />
    );
}