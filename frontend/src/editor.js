import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";

const languages = {
    c: cpp,
    cpp: cpp,
    python,
    javascript,
};

export function createEditor(parent) {
    const language = new Compartment();

    const view = new EditorView({
        doc: "",
        extensions: [
            basicSetup,
            language.of(python()),
        ],
        parent,
    });

    return {
        view,

        setLanguage(name) {
            const extension = languages[name];

            if (!extension) {
                throw new Error(`Unsupported language: ${name}`);
            }

            view.dispatch({
                effects: language.reconfigure(extension()),
            });
        },

        getCode() {
            return view.state.doc.toString();
        },
    };
}