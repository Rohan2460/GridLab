export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export function buttonClass(
    variant: ButtonVariant = "primary",
    size: ButtonSize = "md",
    extra = "",
): string {
    return ["btn", `btn-${variant}`, size === "sm" ? "btn-sm" : "", extra]
        .filter(Boolean)
        .join(" ");
}
