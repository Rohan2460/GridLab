import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    ReactNode,
} from "react";

import type { Tone } from "../types";
import {
    buttonClass,
    type ButtonSize,
    type ButtonVariant,
} from "./buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export function Button({
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={buttonClass(variant, size, className)}
            {...props}
        />
    );
}

export function Badge({
    tone = "neutral",
    children,
}: {
    tone?: Tone;
    children: ReactNode;
}) {
    return <span className={`badge badge-${tone}`}>{children}</span>;
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
    return (
        <div className={`card ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

export function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: ReactNode;
    hint?: string;
}) {
    return (
        <div className="stat-card">
            <span className="stat-card-label">{label}</span>
            <span className="stat-card-value">{value}</span>
            {hint && <span className="stat-card-hint">{hint}</span>}
        </div>
    );
}

export function PageHeader({
    title,
    subtitle,
    actions,
}: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}) {
    return (
        <header className="page-header">
            <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
        </header>
    );
}

export function Section({
    title,
    action,
    children,
    className = "",
}: {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`section ${className}`.trim()}>
            <div className="section-head">
                <h2 className="section-title">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

export function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div className="form-field">
            <label htmlFor={htmlFor}>{label}</label>
            {children}
            {hint && <span className="form-hint">{hint}</span>}
        </div>
    );
}

export function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="empty-state">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {action && <div className="empty-state-action">{action}</div>}
        </div>
    );
}
