"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TokenSelector, Token } from "./token-selector";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens, getQuoteAmount } from "@/lib/api";
import { getTokenBalance } from "@/lib/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { toast } from "sonner";

interface QuoteResponse {
  outAmount: string;
  [key: string]: any;
}

export function SwapCard() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);
  const [fromTokenBalance, setFromTokenBalance] = useState<number>(0);
  const [toTokenBalance, setToTokenBalance] = useState<number>(0);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  const fetchTokenBalances = useCallback(async () => {
    if (!connection || !publicKey) return;

    try {
      if (fromToken) {
        const balance = await getTokenBalance(
          connection,
          publicKey,
          fromToken.id
        );
        setFromTokenBalance(balance);
      }
      if (toToken) {
        const balance = await getTokenBalance(
          connection,
          publicKey,
          toToken.id
        );
        setToTokenBalance(balance);
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
      toast.error("Error fetching balances");
    }
  }, [connection, publicKey, fromToken, toToken]);

  // Get quote from Jupiter API
  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setQuoteResponse(null);
      setToAmount("");
      return null;
    }

    setIsFetchingQuote(true);
    setQuoteError(null);

    try {
      const rawAmount = Math.floor(
        parseFloat(fromAmount) * 10 ** fromToken.decimals!
      );
      const slippageBps = Math.floor(slippage * 100);

      const quote = await getQuoteAmount({
        inputMintAddress: fromToken.id,
        outputMintAddress: toToken.id,
        amount: rawAmount,
        slippage: slippageBps,
      });

      if (!quote?.outAmount) {
        throw new Error("Invalid quote response");
      }

      setQuoteResponse(quote);
      const uiAmount = Number(quote.outAmount) / 10 ** toToken.decimals!;
      setToAmount(uiAmount.toFixed(6));
      return quote;
    } catch (error) {
      console.error("Quote error:", error);
      setQuoteError("Failed to get quote. Please try again.");
      setToAmount("");
      return null;
    } finally {
      setIsFetchingQuote(false);
    }
  }, [fromToken, toToken, fromAmount, slippage]);

  // Perform swap transaction
  const handleSwap = useCallback(async () => {
    if (!publicKey || !signTransaction || !quoteResponse) return;
    setIsTransactionPending(true);
    try {
      const swapTxRes = await fetch(
        `${process.env.NEXT_PUBLIC_JUPITER_QUOTE_API_URL}/swap`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey.toString(),
            wrapAndUnwrapSol: true,
          }),
        }
      );

      const { swapTransaction } = await swapTxRes.json();
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(
        new Uint8Array(swapTransactionBuf)
      );

      // Sign transaction
      const signedTx = await signTransaction(transaction);

      // Get latest blockhash
      const latestBlockHash = await connection.getLatestBlockhash();

      // Send transaction
      const rawTransaction = signedTx.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm transaction
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
      toast.success(`Transaction successful: https://solscan.io/tx/${txid}`);
      // Refresh balances after swap
      await fetchTokenBalances();
    } catch (error) {
      console.error("Swap failed:", error);
      toast.error(
        `Swap failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsTransactionPending(false);
    }
  }, [
    publicKey,
    signTransaction,
    quoteResponse,
    connection,
    fetchTokenBalances,
  ]);

  // Swap token positions
  const swapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setQuoteResponse(null);
  }, [fromToken, toToken, toAmount]);

  // Handle input changes with validation
  const handleInputChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFromAmount(value);
    }
  };

  // Initialize default tokens
  useEffect(() => {
    if (tokens.length > 1 && !fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  // Fetch balances when tokens or connection changes
  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  // Fetch quote when inputs change (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchQuote();
    }, 500);

    return () => clearTimeout(handler);
  }, [fetchQuote]);

  // UI rendering
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
              onClick={fetchTokenBalances}
            >
              <RefreshCw onClick={() => fetchQuote()} className="h-4 w-4" />
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
        {/* From Token Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From</span>
            {fromToken && (
              <span className="text-muted-foreground">
                Balance: {fromTokenBalance.toFixed(4)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TokenSelector
              selectedToken={fromToken}
              onTokenSelect={setFromToken}
              tokens={tokens}
              className="w-32 flex-shrink-0"
            />
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 text-lg font-medium bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/10 focus:bg-white/70 dark:focus:bg-white/10 transition-colors"
              disabled={!fromToken}
            />
          </div>
          {fromAmount && fromToken && (
            <div className="text-xs text-muted-foreground text-right">
              ≈ $
              {(
                parseFloat(fromAmount) * (fromToken.usdPrice || 0)
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={swapTokens}
            className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 transition-all duration-200 hover:scale-105"
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>

        {/* To Token Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            {toToken && (
              <span className="text-muted-foreground">
                Balance: {toTokenBalance.toFixed(4)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TokenSelector
              selectedToken={toToken}
              onTokenSelect={setToToken}
              tokens={tokens}
              className="w-32 flex-shrink-0"
              loading={isLoading}
            />
            <Input
              type="text"
              placeholder="0.0"
              value={isFetchingQuote ? "Calculating..." : toAmount}
              readOnly
              className="flex-1 text-lg font-medium bg-white/30 dark:bg-white/3 border-white/20 dark:border-white/10 cursor-not-allowed"
            />
          </div>
          {toAmount && toToken && (
            <div className="text-xs text-muted-foreground text-right">
              ≈ $
              {(parseFloat(toAmount) * (toToken.usdPrice || 0)).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </div>
          )}
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && !quoteError && (
          <div className="space-y-2 p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span className="font-medium">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum Received</span>
              <span className="font-medium">
                {quoteResponse
                  ? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)
                  : "0.0"}{" "}
                {toToken?.symbol}
              </span>
            </div>
          </div>
        )}

        {quoteError && (
          <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded-lg">
            {quoteError}
          </div>
        )}

        <Button
          onClick={handleSwap}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !connected ||
            !fromAmount ||
            !toAmount ||
            parseFloat(fromAmount) <= 0 ||
            isFetchingQuote ||
            !quoteResponse ||
            isTransactionPending
          }
        >
          {!connected
            ? "Connect Wallet"
            : !fromAmount
            ? "Enter Amount"
            : isFetchingQuote
            ? "Fetching Quote..."
            : quoteError
            ? "Try Again"
            : isTransactionPending
            ? "Transaction in progress..."
            : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
}
