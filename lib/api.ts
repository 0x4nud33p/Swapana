import { Token } from "@/components/swap/token-selector";

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
