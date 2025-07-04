"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
  price?: number;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
  className?: string;
}

const defaultTokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", icon: "🔷", balance: "2.5", price: 2456.78 },
  { symbol: "USDC", name: "USD Coin", icon: "💵", balance: "1,234.56", price: 1.00 },
  { symbol: "USDT", name: "Tether", icon: "💰", balance: "890.12", price: 1.00 },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", balance: "0.125", price: 45678.90 },
  { symbol: "MATIC", name: "Polygon", icon: "🔹", balance: "500.0", price: 0.85 },
  { symbol: "LINK", name: "Chainlink", icon: "🔗", balance: "25.75", price: 15.24 },
  { symbol: "UNI", name: "Uniswap", icon: "🦄", balance: "15.5", price: 8.45 },
  { symbol: "AAVE", name: "Aave", icon: "👻", balance: "3.2", price: 95.67 },
  { symbol: "COMP", name: "Compound", icon: "🏛️", balance: "1.8", price: 65.43 },
  { symbol: "MKR", name: "Maker", icon: "🎯", balance: "0.5", price: 1234.56 },
];

export function TokenSelector({ selectedToken, onTokenSelect, tokens = defaultTokens, className }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-between px-3 py-2 h-auto bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]",
          className
        )}
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedToken.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-xs text-muted-foreground">{selectedToken.name}</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Select token</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl">
          {/* Blue background overlay */}
          <div className="fixed inset-0 bg-blue-500/20 dark:bg-blue-600/30 backdrop-blur-sm -z-10" />
          
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center justify-between">
              Select Token
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 hover:bg-white/10 dark:hover:bg-white/5 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 focus:bg-white/70 dark:focus:bg-white/10 transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredTokens.length > 0 ? (
              <div className="space-y-1 px-2 pb-4">
                {filteredTokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-4 mx-2 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-all duration-200 rounded-lg hover:scale-[1.02] hover:shadow-md"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-lg border border-white/20 dark:border-white/10">
                        {token.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{token.symbol}</span>
                        <span className="text-sm text-muted-foreground">{token.name}</span>
                      </div>
                    </div>
                    {token.balance && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{token.balance}</div>
                        {token.price && (
                          <div className="text-xs text-muted-foreground">
                            ${token.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tokens found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with a different term
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}