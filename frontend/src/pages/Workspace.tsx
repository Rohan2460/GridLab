import { useRef, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router";

import { buttonClass } from "../components/buttonStyles";
import CodeEditor from "../components/Editor";
import Terminal, { type TerminalHandle } from "../components/Terminal";
import { Badge, Button, EmptyState } from "../components/ui";
import { useAuth } from "../context/auth";
import { useData } from "../context/data";
import { starterCode } from "../data/mockData";
import type { EditorLanguage } from "../types";
import {
    activityTypeLabel,
    activityTypeTone,
    fileNameFor,
    findSubmission,
    formatDate,
    languageLabel,
    submissionStatusLabel,
    submissionStatusTone,
} from "../utils";
import "./Workspace.css";

const languages: EditorLanguage[] = ["c", "cpp", "python", "javascript"];

function commandFor(language: EditorLanguage): string {
    const fileName = fileNameFor(language);

    switch (language) {
        case "python":
            return `python3 ${fileName}`;
        case "javascript":
            return `node ${fileName}`;
        case "cpp":
            return `g++ ${fileName} -o main && ./main`;
        default:
            return `gcc ${fileName} -o main && ./main`;
    }
}

function WorkspaceView({ activityId }: { activityId: string | undefined }) {
    const { user } = useAuth();
    const { courses, activities, submissions, submitActivity } = useData();

    const activity = activities.find(
        (item) => item.id === Number(activityId),
    );
    const course = courses.find((item) => item.id === activity?.courseId);

    const terminalRef = useRef<TerminalHandle>(null);
    const [language, setLanguage] = useState<EditorLanguage>(
        activity?.language ?? "c",
    );
    const [code, setCode] = useState(activity?.starterCode ?? "");
    const [notice, setNotice] = useState("");

    if (!user) {
        return null;
    }

    if (!activity || !course) {
        return (
            <div className="page">
                <EmptyState
                    title="Activity not found"
                    description="This activity may have been removed or the link is out of date."
                    action={
                        <Link
                            to="/student"
                            className={buttonClass("secondary", "sm")}
                        >
                            Back to dashboard
                        </Link>
                    }
                />
            </div>
        );
    }

    const currentActivity = activity;
    const currentCourse = course;
    const currentUser = user;

    const submission = findSubmission(
        submissions,
        currentActivity.id,
        currentUser.id,
    );
    const isDirty = code !== currentActivity.starterCode;

    function writeTerminalWelcome() {
        const terminal = terminalRef.current;
        if (!terminal) {
            return;
        }

        terminal.clear();
        terminal.writeLine("Welcome to GridLab!");
        terminal.writeLine("Connected to sandbox workspace.");
        terminal.write("$ ");
    }

    function runCode() {
        const terminal = terminalRef.current;
        if (!terminal) {
            return;
        }

        const output =
            currentActivity.title === "Hello World"
                ? "Hello, World!"
                : currentActivity.title === "Add Two Numbers"
                  ? "42"
                  : "Program executed successfully.";

        terminal.clear();
        terminal.writeLine(`$ ${commandFor(language)}`);
        terminal.writeLine("");
        terminal.writeLine(output);
        terminal.writeLine("");
        terminal.writeLine("Process finished with exit code 0");
        terminal.writeLine("");
        terminal.write("$ ");
    }

    function resetCode() {
        setLanguage(currentActivity.language);
        setCode(currentActivity.starterCode);
        setNotice("");
        writeTerminalWelcome();
    }

    function changeLanguage(event: ChangeEvent<HTMLSelectElement>) {
        const nextLanguage = event.target.value as EditorLanguage;
        setLanguage(nextLanguage);
        setCode(starterCode[nextLanguage]);
        setNotice("");
    }

    function submitCode() {
        submitActivity(currentActivity.id, currentUser.id, code, language);
        setNotice("Submission sent for review.");
    }

    return (
        <div className="workspace">
            <header className="workspace-header">
                <div className="workspace-header-main">
                    <Link
                        to={`/courses/${currentCourse.id}`}
                        className="workspace-back"
                    >
                        Back to {currentCourse.code}
                    </Link>

                    <div className="workspace-title-row">
                        <h1>{currentActivity.title}</h1>
                        <Badge tone={activityTypeTone(currentActivity.type)}>
                            {activityTypeLabel(currentActivity.type)}
                        </Badge>
                        <Badge
                            tone={
                                submission
                                    ? submissionStatusTone(submission.status)
                                    : "neutral"
                            }
                        >
                            {submission
                                ? submissionStatusLabel(submission.status)
                                : "Not started"}
                        </Badge>
                    </div>

                    <p className="workspace-description">
                        {currentActivity.description} · Due{" "}
                        {formatDate(currentActivity.dueOn)}
                    </p>
                </div>

                <div className="workspace-actions">
                    <select
                        className="select workspace-language"
                        value={language}
                        onChange={changeLanguage}
                        aria-label="Editor language"
                    >
                        {languages.map((value) => (
                            <option key={value} value={value}>
                                {languageLabel(value)}
                            </option>
                        ))}
                    </select>

                    <Button variant="secondary" onClick={resetCode}>
                        Reset
                    </Button>
                    <Button variant="secondary" onClick={runCode}>
                        Run
                    </Button>
                    <Button onClick={submitCode}>Submit</Button>
                </div>
            </header>

            {notice && (
                <div className="workspace-notice" role="status">
                    <span>{notice}</span>
                    <button
                        type="button"
                        className="notice-dismiss"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="workspace-body">
                <section className="code-panel editor-panel">
                    <div className="panel-header">
                        <span>{fileNameFor(language)}</span>
                        <span className="panel-meta">
                            {languageLabel(language)}
                            {isDirty ? " · Unsaved changes" : " · Saved"}
                        </span>
                    </div>
                    <CodeEditor
                        value={code}
                        language={language}
                        onChange={setCode}
                    />
                </section>

                <section className="code-panel terminal-panel">
                    <div className="panel-header">
                        <span>Terminal</span>
                        <button
                            type="button"
                            className="panel-action"
                            onClick={writeTerminalWelcome}
                        >
                            Clear
                        </button>
                    </div>
                    <Terminal ref={terminalRef} />
                </section>
            </div>

            <footer className="workspace-footer">
                <span>
                    {languageLabel(language)} · {code.length} characters
                </span>
                <span>
                    {currentCourse.code} · {currentCourse.title}
                </span>
            </footer>
        </div>
    );
}

export default function Workspace() {
    const { activityId } = useParams();

    return <WorkspaceView key={activityId} activityId={activityId} />;
}
