"use client";

import { useTheme } from "next-themes";

export default function BackgroundGrid() {
  const { resolvedTheme } = useTheme();

  const isDark =
    resolvedTheme === "dark" ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: isDark
          ? "hsl(var(--background))"
          : "hsl(var(--background))",
        backgroundImage: isDark
          ? `
            radial-gradient(circle at 0.4px 0.4px, rgba(139, 92, 246, 0.2) 0.4px, transparent 0),
            radial-gradient(circle at 0.4px 0.4px, rgba(59, 130, 246, 0.18) 0.4px, transparent 0),
            radial-gradient(circle at 0.4px 0.4px, rgba(236, 72, 153, 0.15) 0.4px, transparent 0)`
          : `
            linear-gradient(to right, rgba(209,213,219,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(209,213,219,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)`,
        backgroundSize: isDark
          ? "20px 20px, 30px 30px, 25px 25px"
          : "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    />
  );
}