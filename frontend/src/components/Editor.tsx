import { useEffect, useRef } from "react";
import { basicSetup, EditorView } from "codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

import type { EditorLanguage } from "../types";

const darkTheme = EditorView.theme(
    {
        "&": {
            height: "100%",
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
        },
        ".cm-content": {
            padding: "14px 0",
            caretColor: "#93c5fd",
        },
        ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: "#93c5fd",
        },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
            {
                backgroundColor: "#334155",
            },
        ".cm-gutters": {
            border: "none",
            backgroundColor: "#0f172a",
            color: "#64748b",
        },
        ".cm-activeLine": {
            backgroundColor: "#1e293b66",
        },
        ".cm-activeLineGutter": {
            backgroundColor: "#1e293b66",
            color: "#cbd5e1",
        },
        ".cm-lineNumbers .cm-gutterElement": {
            padding: "0 10px 0 16px",
        },
        ".cm-scroller": {
            fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
            lineHeight: "1.55",
        },
        ".cm-tooltip": {
            border: "1px solid #334155",
            backgroundColor: "#1e293b",
            color: "#e2e8f0",
        },
        ".cm-panels": {
            backgroundColor: "#111827",
            color: "#e2e8f0",
        },
    },
    { dark: true },
);

const darkHighlight = HighlightStyle.define([
    { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" },
    {
        tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword],
        color: "#c084fc",
    },
    {
        tag: [tags.function(tags.variableName), tags.labelName],
        color: "#60a5fa",
    },
    {
        tag: [tags.typeName, tags.className, tags.name, tags.propertyName],
        color: "#22d3ee",
    },
    {
        tag: [tags.string, tags.character, tags.inserted],
        color: "#86efac",
    },
    { tag: [tags.number, tags.bool, tags.null], color: "#fbbf24" },
    {
        tag: [tags.operator, tags.operatorKeyword, tags.escape, tags.regexp],
        color: "#f472b6",
    },
    { tag: [tags.meta, tags.annotation], color: "#94a3b8" },
    { tag: tags.link, color: "#93c5fd", textDecoration: "underline" },
    { tag: tags.heading, fontWeight: "bold", color: "#e2e8f0" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },
    { tag: tags.invalid, color: "#fca5a5" },
]);

function languageExtension(language: EditorLanguage) {
    switch (language) {
        case "python":
            return python();
        case "javascript":
            return javascript();
        case "cpp":
        case "c":
        default:
            return cpp();
    }
}

interface CodeEditorProps {
    value: string;
    language: EditorLanguage;
    onChange?: (code: string) => void;
    readOnly?: boolean;
}

export default function CodeEditor({
    value,
    language,
    onChange,
    readOnly = false,
}: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const valueRef = useRef(value);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const view = new EditorView({
            doc: valueRef.current,
            extensions: [
                basicSetup,
                languageExtension(language),
                darkTheme,
                syntaxHighlighting(darkHighlight),
                EditorView.editable.of(!readOnly),
                ...(readOnly
                    ? []
                    : [
                          EditorView.updateListener.of((update) => {
                              if (update.docChanged) {
                                  onChangeRef.current?.(
                                      update.state.doc.toString(),
                                  );
                              }
                          }),
                      ]),
            ],
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, [language, readOnly]);

    useEffect(() => {
        const view = viewRef.current;
        if (!view) {
            return;
        }

        const currentValue = view.state.doc.toString();
        if (currentValue !== value) {
            view.dispatch({
                changes: {
                    from: 0,
                    to: currentValue.length,
                    insert: value,
                },
            });
        }
    }, [value]);

    return <div ref={editorRef} className="editor-container" />;
}
