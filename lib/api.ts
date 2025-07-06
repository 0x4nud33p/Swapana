import { Token } from "@/components/swap/token-selector";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
  TokenAccountNotFoundError
} from "@solana/spl-token";

interface quoteParams {
  inputMintAddress: string;
  outputMintAddress: string;
  amount: number;
  slippage: number;
}

const JUPITER_BASE_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL;
const JUPITER_QUOTE_URL = process.env.NEXT_PUBLIC_JUPITER_QUOTE_API_URL;

if (!JUPITER_BASE_URL || !JUPITER_QUOTE_URL) {
  throw new Error("NEXT_PUBLIC_JUPITER_API_URL or NEXT_PUBLIC_JUPITER_QUOTE_API_URL is not defined in .env");
}

const HEADERS = {
  "Content-Type": "application/json",
};

export async function fetchTokens(): Promise<Token[]>{
  const res = await fetch(`${JUPITER_BASE_URL}/toporganicscore/24h?limit=100`, {
    method: "GET",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tokens: ${res.statusText}`);
  }

  return res.json();
};

export async function searchToken(query: string): Promise<Token>{

  const res = await fetch(`${JUPITER_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error(`Failed to search token: ${res.statusText}`);
  }

  return res.json();
};

export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  mintAddress: string
): Promise<number> {
  try {
    const mint = new PublicKey(mintAddress);
    const ata = await getAssociatedTokenAddress(mint, walletAddress);
    const accountInfo = await getAccount(connection, ata);
    const mintInfo = await getMint(connection, mint);

    const balance = Number(accountInfo.amount) / 10 ** mintInfo.decimals;
    console.log(`balance of ${mintAddress}: ${balance}`);
    return balance;
  } catch (error: any) {
    if (error instanceof TokenAccountNotFoundError) {
      return 0;
    }
    console.error("Failed to fetch token balance", error);
    return 0;
  }
}

export async function getQuoteAmount(params: quoteParams) {
  try {
    const response = await fetch(`${JUPITER_QUOTE_URL}/quote?inputMint=${params.inputMintAddress}&outputMint=${params.outputMintAddress}&amount=${params.amount}&slippageBps=${params.slippage}`);
    console.log("Quote URL:", `${JUPITER_QUOTE_URL}/quote?inputMint=${params.inputMintAddress}&outputMint=${params.outputMintAddress}&amount=${params.amount}&slippageBps=${params.slippage}`);
    const data = await response.json();
    console.log("Quote data:", data);
    return data;
  } catch (error) {
    console.log("error while quoting for swap",error);
  }
}