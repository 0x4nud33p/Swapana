"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TokenSelector, Token } from "./token-selector";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/lib/api";

export function SwapCard() {
  const [fromToken, setFromToken] = useState<Token | null>();
  const [toToken, setToToken] = useState<Token | null>();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);

  const {
    data: tokens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Mock calculation for demo
    if (value && fromToken && toToken) {
      const mockRate = fromToken.price! / toToken.price!;
      const calculatedAmount = (parseFloat(value) * mockRate * (1 - slippage / 100)).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount("");
    }
  };

  const estimatedGas = "$12.45";
  const priceImpact = "0.02%";

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-white/20 dark:border-white/10 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold">Swap</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/10 dark:hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/10 dark:hover:bg-white/5"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From</span>
            {fromToken?.balance && (
              <span className="text-muted-foreground">
                Balance: {fromToken.balance} {fromToken.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TokenSelector
              selectedToken={tokens[0]}
              onTokenSelect={setFromToken}
              tokens={tokens}
              className="w-32 flex-shrink-0"
            />
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 text-lg font-medium bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 focus:bg-white/70 dark:focus:bg-white/10 transition-colors"
            />
          </div>
          {fromAmount && fromToken && (
            <div className="text-xs text-muted-foreground text-right">
              ≈ ${(parseFloat(fromAmount) * fromToken.price!).toLocaleString()}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapTokens}
            className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 transition-all duration-200 hover:scale-105"
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            {toToken?.balance && (
              <span className="text-muted-foreground">
                Balance: {toToken.balance} {toToken.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TokenSelector
              selectedToken={tokens[1]}
              onTokenSelect={setToToken}
              tokens={tokens}
              className="w-32 flex-shrink-0"
              loading={isLoading}
            />
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="flex-1 text-lg font-medium bg-white/30 dark:bg-white/3 border-white/20 dark:border-white/10 cursor-not-allowed"
            />
          </div>
          {toAmount && toToken && (
            <div className="text-xs text-muted-foreground text-right">
              ≈ ${(parseFloat(toAmount) * toToken.price!).toLocaleString()}
            </div>
          )}
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="space-y-2 p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span
                className={cn(
                  "font-medium",
                  parseFloat(priceImpact) > 1
                    ? "text-yellow-600"
                    : "text-green-600"
                )}
              >
                {priceImpact}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Gas</span>
              <span className="font-medium">{estimatedGas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="font-medium">{slippage}%</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
          disabled={!fromAmount || !toAmount}
        >
          {!fromAmount || !toAmount ? "Enter amount" : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
}