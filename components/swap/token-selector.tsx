"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { searchToken } from "@/lib/api";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance?: string;
  price?: number;
  decimals?: number;
  tokenProgram: string;
  usdPrice?: number;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
  className?: string;
  loading?: Boolean;
}

export function TokenSelector({
  selectedToken,
  onTokenSelect,
  tokens,
  className,
  loading,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchedTokens } = useQuery({
    queryKey: ["searchToken", searchTerm],
    queryFn: () => searchToken(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setOpen(false);
    setSearchTerm("");
  };

  const filteredTokens: Token[] =
    searchTerm.trim() === ""
      ? tokens
      : Array.isArray(searchedTokens)
      ? searchedTokens
      : [];

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
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            <Image
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-white/20 dark:border-white/10"
              src={selectedToken.icon}
              alt={selectedToken.name}
              width={40}
              height={40}
            />
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-sm sm:text-base font-medium">
                {selectedToken.symbol}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Select token</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl">
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

          <div className="px-6 pb-4 mr-2">
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
                    key={token.id}
                    className="flex items-center justify-between p-4 mx-2 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-all duration-200 rounded-lg hover:scale-[1.02] hover:shadow-md"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-lg border border-white/20 dark:border-white/10"
                        src={token.icon}
                        alt={token.name}
                        width={40}
                        height={40}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {token.symbol}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {token.name}
                        </span>
                      </div>
                    </div>
                    {token.balance && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {token.balance}
                        </div>
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tokens found
                </h3>
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
