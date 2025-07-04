"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function BackgroundGrid() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("resolved theme in initial render",resolvedTheme);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark" || resolvedTheme === "undefined";
  
  console.log("resolved theme in initial render", resolvedTheme);

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: isDark ? "#020617" : "#ffffff",
        backgroundImage: isDark
          ? `
            linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)`
          : `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)`,
        backgroundSize: isDark
          ? "40px 40px, 40px 40px, 100% 100%"
          : "48px 48px, 48px 48px, 100% 100%, 100% 100%",
      }}
    />
  );
}
