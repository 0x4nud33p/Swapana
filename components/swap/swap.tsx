"use client";

import { Navbar } from "./navbar";
import { SwapCard } from "./swap-card";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react';

export function Swap() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [network, setNetwork] = useState<string | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const version = await connection.getVersion();
        console.log("Cluster version:", version);
        const slot = await connection.getSlot();
        const blockTime = await connection.getBlockTime(slot);
        setNetwork("devnet");
      } catch (err) {
        console.error("Error checking network:", err);
        setNetwork("unknown");
      }
    };

    if (publicKey) {
      checkNetwork();
    }
  }, [connection, publicKey]);
  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-500">
      <div className="absolute inset-0 opacity-20"></div>
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse-soft dark:hidden"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80  rounded-full blur-3xl animate-pulse-soft dark:hidden"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-soft hidden dark:block"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80  rounded-full blur-3xl animate-pulse-soft hidden dark:block"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <SwapCard />
        </main>
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>This application is for Devnet use only.</p>
          <span className="font-semibold text-red-300">
            connected to {network}
          </span>
        </footer>
      </div>
    </div>
  );
}
