"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function BackgroundGrid() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevent SSR mismatch

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: "hsl(var(--background))",
        backgroundImage: isDark
          ? `
              radial-gradient(circle at 30% 40%, rgba(139,92,246,0.05), transparent 50%),
              linear-gradient(to bottom, rgba(var(--grid-line) / 0.15) 1px, transparent 1px),
              radial-gradient(circle at 30% 40%, rgba(139,92,246,0.15), transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236,72,153,0.1), transparent 60%)`
          : `
              linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
              radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
              radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)`,
        backgroundSize: isDark
          ? "40px 40px, 40px 40px, 100% 100%, 100% 100%"
          : "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    />
  );
}
