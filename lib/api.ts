import { Token } from "@/components/swap/token-selector";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
} from "@solana/spl-token";


const JUPITER_BASE_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL;

if (!JUPITER_BASE_URL) {
  throw new Error("NEXT_PUBLIC_JUPITER_API_URL is not defined in .env");
}

const HEADERS = {
  "Content-Type": "application/json",
};

export const fetchTokens = async (): Promise<Token[]> => {
  const res = await fetch(`${JUPITER_BASE_URL}/recent`, {
    method: "GET",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tokens: ${res.statusText}`);
  }

  return res.json();
};

export const searchToken = async (query: string): Promise<Token> => {

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
): Promise<number | null> {
  try {
    const mint = new PublicKey(mintAddress);
    const ata = await getAssociatedTokenAddress(mint, walletAddress);
    const accountInfo = await getAccount(connection, ata);
    const mintInfo = await getMint(connection, mint);

    const balance = Number(accountInfo.amount) / 10 ** mintInfo.decimals;
    return balance;
  } catch (error: any) {
    if (error.message?.includes("could not find account")) return 0;
    console.error("Failed to fetch token balance", error);
    return null;
  }
}