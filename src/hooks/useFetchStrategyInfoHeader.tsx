import {
  aaveOracleAbi,
  aaveOracleAddress,
  cbEthAddress,
  loopStrategyAbi,
  loopStrategyAddress,
} from "../generated/generated";
import {
  convertRatioToMultiple,
  formatBigIntOnTwoDecimals,
} from "../utils/helpers";
import { useReadContracts } from "wagmi";

export const useFetchStrategyInfoHeader = () => {
  const { data: results } = useReadContracts({
    contracts: [
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "getCollateralRatioTargets",
      },
      {
        address: aaveOracleAddress,
        abi: aaveOracleAbi,
        functionName: "getAssetPrice",
        args: [cbEthAddress],
      },
    ],
  });
  const targetMultiple = convertRatioToMultiple(results?.[0].result?.target);

  return {
    targetMultiple: formatBigIntOnTwoDecimals(targetMultiple, 8),
    oraclePrice: formatBigIntOnTwoDecimals(results?.[1].result, 8),
  };
};
