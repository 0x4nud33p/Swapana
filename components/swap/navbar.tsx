"use client";

import { Wallet } from "lucide-react";
import { WalletButton } from "@/components/providers/wallet-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useWallet } from "@solana/wallet-adapter-react";

export function Navbar() {
  const { connected } = useWallet();
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          swapana
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {connected ? (
          <WalletButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl" />
        ) : (
          <WalletButton className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </WalletButton>
        )}
      </div>
    </nav>
  );
}