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
        background: isDark ? "#000000" : "",  
        backgroundImage: isDark
          ? `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)`
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