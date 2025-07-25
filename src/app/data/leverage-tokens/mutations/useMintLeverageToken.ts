import { getParsedError, SeamlessWriteAsyncParams, useNotificationContext, useSeamlessContractWrite } from "@shared";
import { Address, parseEventLogs } from "viem";
import { useAccount } from "wagmi";
import { getPublicClient, simulateContract } from "wagmi/actions";
import { LeverageManagerAbi } from "../../../../../abis/LeverageManager";
import { config, targetChain } from "../../../config/rainbow.config";
import { leverageRouterAbi, leverageRouterAddress } from "../../../generated";
import { getConfig } from "../../../utils/queryContractUtils";
import { SwapContext } from "../hooks/useFetchAerodromeRoute";

export const getMintedShares = async (txHash: `0x${string}`) => {
  const client = getPublicClient(config);
  const { logs } = await client.getTransactionReceipt({ hash: txHash });

  const parsedLogs = parseEventLogs({
    abi: LeverageManagerAbi,
    eventName: "Mint",
    logs,
  });

  return parsedLogs[0].args.actionData.shares;
};

export const useMintLeverageToken = (settings?: SeamlessWriteAsyncParams) => {
  /* ------------- */
  /*   Meta data   */
  /* ------------- */
  const { address } = useAccount();
  const { showNotification } = useNotificationContext();

  /* ----------------- */
  /*   Mutation config */
  /* ----------------- */
  const { writeContractAsync, ...rest } = useSeamlessContractWrite({
    ...settings,
    queriesToInvalidate: [undefined],
  });

  /* -------------------- */
  /*   Mutation wrapper   */
  /* -------------------- */
  const mintAsync = async (args: {
    leverageToken?: Address;
    amount?: bigint;
    minShares?: bigint;
    maxSwapCostInCollateral?: bigint;
    swapContext?: SwapContext;
  }) => {
    try {
      const { leverageToken, amount, minShares, maxSwapCostInCollateral, swapContext } = args;
      if (!amount) throw new Error("Amount is not defined. Please ensure the amount is greater than 0.");
      if (!address) throw new Error("Account address is not found. Please re-connect your wallet.");
      if (!minShares) throw new Error("Min shares is not defined.");
      if (!maxSwapCostInCollateral) throw new Error("Max swap cost in collateral is not defined.");
      if (!leverageToken) throw new Error("Leverage token is not defined.");

      const amountAfterSwapCost = amount - maxSwapCostInCollateral;

      // Simulate the mint first, which will throw an error including any revert strings in the error message
      // and notification
      await simulateContract(getConfig(), {
        address: leverageRouterAddress,
        abi: leverageRouterAbi,
        functionName: "mint",
        args: [leverageToken, amountAfterSwapCost, minShares, maxSwapCostInCollateral, swapContext as never],
      });

      await writeContractAsync({
        chainId: targetChain.id,
        address: leverageRouterAddress,
        abi: leverageRouterAbi,
        functionName: "mint",
        args: [leverageToken, amountAfterSwapCost, minShares, maxSwapCostInCollateral, swapContext as never],
      });
    } catch (error) {
      console.error("Failed to mint", error);
      showNotification({
        status: "error",
        content: `Failed to mint: ${getParsedError(error)}`,
      });
    }
  };

  return { ...rest, isMintPending: rest.isPending, mintAsync };
};
