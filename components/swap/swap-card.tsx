"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TokenSelector, Token } from "./token-selector";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens, getQuoteAmount } from "@/lib/api";
import { getTokenBalance } from "@/lib/api";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function SwapCard() {
  const [fromToken, setFromToken] = useState<Token | null>();
  const [toToken, setToToken] = useState<Token | null>();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [quoteResponseAmount, setQuoteResponseAmount] = useState<number>(0);
  const [fromTokenBalance, setFromTokenBalance] = useState<number | null>(null);
  const [toTokenBalance, settoTokenBalance] = useState<number | null>(null);

  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const {
    data: tokens = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
  });

  const handleGetQuoteResponse = async () => {
    if (!fromToken || !toToken) {
      console.log("Select tokens first");
      return;
    }

    console.log("Swapping tokens...");
    console.log("From Token:", fromToken.symbol);
    console.log("To Token:", toToken.symbol);
    console.log("From Amount:", fromAmount);
    console.log("To Amount:", toAmount);
    console.log("Decimals:", fromToken.decimals, toToken.decimals);

    const rawAmount = Math.floor(
      parseFloat(fromAmount) * 10 ** fromToken.decimals!
    );
    const slippageBps = Math.floor(slippage * 100);

    console.log("Swapping tokens:", {
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      amount: rawAmount,
      slippage: slippageBps,
    });

    try {
      const quoteResponse = await getQuoteAmount({
        inputMintAddress: fromToken.id,
        outputMintAddress: toToken.id,
        amount: rawAmount,
        slippage: slippageBps,
      });

      console.log("Quote data:", quoteResponse);

      if (quoteResponse?.outAmount) {
        setQuoteResponseAmount(quoteResponse.outAmount);
        const uiAmount =
          Number(quoteResponse.outAmount) / 10 ** toToken.decimals!;
        setToAmount(uiAmount.toFixed(6));
        return quoteResponse;
      } else {
        console.warn("No outAmount in quote response");
        setToAmount("0");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  const handleSwapTokens = async () => {
    const quoteResonseForSwap = handleGetQuoteResponse();
    const swapTxRes = await fetch(
      `${process.env.NEXT_PUBLIC_JUPITER_QUOTE_API_URL}/swap`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResonseForSwap,
          userPublicKey: publicKey,
          wrapAndUnwrapSol: true,
        }),
      }
    );
    const { swapTransaction } = await swapTxRes.json();
    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log(transaction);

    // sign the transaction
    transaction.sign([signTransaction]);
    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txid,
    });
    console.log(`https://solscan.io/tx/${txid}`);
  };



  // Function to handle token exchange (swap fromToken and toToken)
  const handleTokenExchange = () => {
    if (!fromToken || !toToken) {
      console.log("Please select both tokens to swap.");
      return;
    }
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("");
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Mock calculation for demo
    if (value && fromToken && toToken) {
      const mockRate = fromToken.price! / toToken.price!;
      const calculatedAmount = (
        parseFloat(value) *
        mockRate *
        (1 - slippage / 100)
      ).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      ("");
    }
  };

  const estimatedGas = "$12.45";
  const priceImpact = "0.02%";

  useEffect(() => {
    if (tokens.length > 1 && !fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (connection && publicKey && fromToken && toToken) {
        const fromTokenbalance = await getTokenBalance(
          connection,
          publicKey,
          fromToken.id
        );
        setFromTokenBalance(fromTokenbalance);
        const toTokenbalance = await getTokenBalance(
          connection,
          publicKey,
          toToken.id
        );
        settoTokenBalance(toTokenbalance);
      }
    };
    fetchBalance();
  }, [connection, publicKey, fromToken]);

  useEffect(() => {
    handleGetQuoteResponse();
  }, [fromToken, toToken, fromAmount]);

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
            {fromToken && (
              <span className="text-muted-foreground">
                Balance: {fromTokenBalance ?? 0}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TokenSelector
              selectedToken={fromToken!}
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
              ≈ $
              {(parseFloat(fromAmount) * fromToken.usdPrice!).toLocaleString()}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTokenExchange}
            className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 transition-all duration-200 hover:scale-105"
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            {toToken && (
              <span className="text-muted-foreground">
                Balance: {toTokenBalance ?? 0}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TokenSelector
              selectedToken={toToken!}
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
          {toAmount && toToken && quoteResponseAmount && (
            <div className="text-xs text-muted-foreground text-right">
              ≈ ${(parseFloat(toAmount) * toToken.usdPrice!).toLocaleString()}
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
          onClick={handleSwapTokens}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
          disabled={!fromAmount || !toAmount}
        >
          {!fromAmount
            ? "Enter Amount"
            : !quoteResponseAmount
            ? "Get Quote"
            : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
}
