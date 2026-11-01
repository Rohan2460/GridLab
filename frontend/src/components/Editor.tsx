import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { cpp } from "@codemirror/lang-cpp";


interface CodeEditorProps {
    initialCode: string;
    onChange: (code: string) => void;
}

export default function CodeEditor({
    initialCode,
    onChange
}: CodeEditorProps) {

    // 1. Reference to the HTML element
    const editorRef = useRef<HTMLDivElement>(null);

    // Keep the latest callback without recreating the editor
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // 2. Initialize CodeMirror
    useEffect(() => {

        if (!editorRef.current) return;

        const editor = new EditorView({

            // Initial editor content
            doc: initialCode,

            // Editor configuration
            extensions: [
                basicSetup,
                cpp(),

                // Detect changes
                EditorView.updateListener.of((update) => {

                    if (update.docChanged) {
                        const code = update.state.doc.toString();
                        onChangeRef.current(code);
                    }

                })
            ],

            // Attach CodeMirror to our div
            parent: editorRef.current
        });

        // 3. Cleanup
        return () => {
            editor.destroy();
        };

    }, []);

    // 4. React renders this element
    return (
        <div ref={editorRef} className="editor-container" />
    );
}