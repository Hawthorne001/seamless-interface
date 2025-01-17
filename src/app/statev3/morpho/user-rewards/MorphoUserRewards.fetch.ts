// Fetch function
import axios from "axios";
import { FetchUserRewardsResponse } from "../types/UserReward";
import { base } from "viem/chains";
import { Address } from "viem";
import { getQueryClient } from "../../../contexts/CustomQueryClientProvider";
import { extendAndMapMorphoRewards, pricePrecision } from "../mappers/extendAndMapMorphoRewards";
import { formatFetchBigIntToViewBigInt } from "../../../../shared";

const BASE_URL = "https://rewards.morpho.org/v1";

export async function fetchRawMorphoUserRewards(
  userAddress: Address,
  chainId = base.id
): Promise<FetchUserRewardsResponse> {
  const client = getQueryClient();

  const response = await client.fetchQuery({
    queryKey: ["fetchMorphoUserRewards", userAddress, chainId],
    queryFn: async () => {
      const url = `${BASE_URL}/users/${userAddress}/rewards?chain_id=${chainId}`;
      const response = await axios.get<FetchUserRewardsResponse>(url);

      return response.data;
    },
  });

  return response;
}

export async function fetchMorphoExtendedMappedUserRewards(userAddress: Address, chainId = base.id) {
  const rewardsResponse = await fetchRawMorphoUserRewards(userAddress, chainId);
  const extendedRewards = await extendAndMapMorphoRewards(rewardsResponse);
  const totalUsdValue = extendedRewards?.reduce((acc, reward) => acc + (reward?.combinedAmountUsd?.bigIntValue || 0n), 0n);

  return {
    rewards: extendedRewards,
    totalUsdValueViewValue: formatFetchBigIntToViewBigInt({
      bigIntValue: totalUsdValue,
      decimals: pricePrecision,
      symbol: "$",
    }),
    totalUsdValue,
  };
}