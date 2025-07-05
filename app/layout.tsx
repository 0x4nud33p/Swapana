import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import BackgroundGrid from "@/components/BackgroundGrid";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SolanaProvider } from "@/components/providers/wallet-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swapana - Decentralized Exchange",
  description: "Trade cryptocurrencies on a modern decentralized exchange",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <html lang="en" suppressHydrationWarning>
        <body className={spaceGrotesk.className} suppressHydrationWarning>
          <QueryProvider>
            <SolanaProvider>
              <BackgroundGrid />
              <div className="relative z-10">{children}</div>
            </SolanaProvider>
          </QueryProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
