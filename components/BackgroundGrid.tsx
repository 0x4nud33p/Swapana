"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function BackgroundGrid() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: isDark ? "#020617" : "",
        backgroundImage: isDark
          ? `
            radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)
            `
          : `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)`,
        backgroundSize: isDark
          ? "20px 20px, 30px 30px, 25px 25px"
          : "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed",
      }}
    />
  );
}