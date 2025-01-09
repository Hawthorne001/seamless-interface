import { Address, erc20Abi } from "viem";
import { FetchData } from "../../types/Fetch";
import { getConfig } from "../../../app/utils/queryContractUtils";
import { getQueryClient } from "../../../app/contexts/CustomQueryClientProvider";
import { readContractQueryOptions } from "wagmi/query";
import { queryConfig } from "../../../app/statev3/settings/queryConfig";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenLogoFromCoinGecko } from "./fetchTokenLogoFromCoinGecko";
import { fetchTokenLogoFromMoralis } from "./fetchTokenLogoFromMoralis";
import { addressIconMap } from "../../../meta";

export interface Token {
  symbol: string;
  decimals: number;
  name: string;
  logo?: string;
}

export async function fetchDecimals(token: Address): Promise<number> {
  const queryClient = getQueryClient();

  const decimals = await queryClient.fetchQuery({
    ...readContractQueryOptions(getConfig(), {
      address: token,
      abi: erc20Abi,
      functionName: "decimals",
    }),
    ...queryConfig.metadataQueryConfig,
  });

  return decimals;
}

export async function fetchSymbol(token: Address): Promise<string> {
  const queryClient = getQueryClient();

  const symbol = await queryClient.fetchQuery({
    ...readContractQueryOptions(getConfig(), {
      address: token,
      abi: erc20Abi,
      functionName: "symbol",
    }),
    ...queryConfig.metadataQueryConfig,
  });

  return symbol;
}

export async function fetchName(token: Address): Promise<string> {
  const queryClient = getQueryClient();

  const name = await queryClient.fetchQuery({
    ...readContractQueryOptions(getConfig(), {
      address: token,
      abi: erc20Abi,
      functionName: "name",
    }),
    ...queryConfig.metadataQueryConfig,
  });

  return name;
}

/**
 * Attempts to retrieve a token logo URL from multiple sources, in this order:
 * 1. **Local icon map** (addressIconMap)
 * 2. **Moralis**
 * 2. **Trust Wallet Assets**
 * 3. **CoinGecko**
 *
 * If a valid logo URL is found at any step, it returns immediately.
 * Otherwise, returns `undefined` if no logo is found.
 *
 * @param token - The token address.
 * @returns The logo URL, or `undefined` if none is available.
 */
export async function fetchTokenLogoWithFallbacks(token: Address): Promise<string | undefined> {
  const logoFromConfig = addressIconMap.get(token);
  if (logoFromConfig) return logoFromConfig;
  // eslint-disable-next-line no-console
  console.warn("Logo not found in addressIconMap", token);

  const queryClient = getQueryClient();

  const coinGeckoUrl = await queryClient.fetchQuery({
    queryKey: ["fetchTokenLogoFromCoinGecko", token],
    queryFn: () => fetchTokenLogoFromCoinGecko(token),
    ...queryConfig.metadataQueryConfig,
  });
  if (coinGeckoUrl) return coinGeckoUrl;
  console.error("Could not fetch coin gecko logo", token);

  const moralisLogo = await queryClient.fetchQuery({
    queryKey: ["fetchTokenLogoFromMoralis", token],
    queryFn: () => fetchTokenLogoFromMoralis(token),
    ...queryConfig.metadataQueryConfig,
  });
  if (moralisLogo) return moralisLogo;
  console.error("Could not fetch moralis logo", token);

  return undefined;
}

/**
 * Fetches the token metadata (symbol, decimals, and optional logo) for the given token address.
 * Internally calls:
 *  - `fetchSymbol(token)`   to retrieve the token symbol,
 *  - `fetchDecimals(token)` to retrieve the token decimals, and
 *  - `fetchTokenLogoWithFallbacks(token)` to attempt to retrieve the token’s logo.
 *
 * @param token - The address of the token.
 * @returns A `Token` object containing the symbol, decimals, and optionally, a logo URL.
 * @throws Will throw an error if symbol or decimals cannot be fetched.
 */
export async function fetchToken(token: Address): Promise<Token> {
  const [symbol, decimals, name, logo] = await Promise.all([
    fetchSymbol(token),
    fetchDecimals(token),
    fetchName(token),
    fetchTokenLogoWithFallbacks(token),
  ]);
  if (!symbol || !decimals) {
    throw new Error("Failed to fetch token data");
  }

  return {
    symbol,
    decimals,
    name,
    logo,
  };
}

interface TokenHookData {
  symbol?: string;
  decimals?: number;
  name?: string;
  logo?: string;
}

export const useToken = (asset?: Address): FetchData<TokenHookData> => {
  const { data, ...rest } = useQuery({
    queryKey: ["hookFetchToken", asset],
    queryFn: () => fetchToken(asset!),
    enabled: !!asset,
    ...queryConfig.disableCacheQueryConfig,
  });

  return {
    ...rest,
    data: data || {
      symbol: undefined,
      decimals: undefined,
      name: undefined,
      logo: undefined,
    },
  };
};
