import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

export function createTerminal(parent) {
    const terminal = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        convertEol: true,
    });

    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(parent);
    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
    });

    resizeObserver.observe(parent);

    return {
        terminal,
        fitAddon,

        dispose() {
            resizeObserver.disconnect();
            terminal.dispose();
        },
    };
}