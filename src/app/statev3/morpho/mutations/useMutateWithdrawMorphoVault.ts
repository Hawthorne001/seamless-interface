import { getParsedError, SeamlessWriteAsyncParams, useNotificationContext, useSeamlessSendTransaction } from "@shared";
import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  ChainId,
  DEFAULT_SLIPPAGE_TOLERANCE,
  getChainAddresses as getMorphoChainAddresses,
} from "@morpho-org/blue-sdk";
import { QueryKey } from "@tanstack/react-query";
import { useFetchAssetBalance } from "../../common/queries/useFetchViewAssetBalance";
import { setupBundle } from "../simulation/setupBundle";
import { useFetchRawFullVaultInfo } from "../full-vault-info/FullVaultInfo.hook";
import { fetchSimulationState } from "../simulation/fetchSimulationState";
import { getFormattedAssetBalanceUsdValueQueryKey } from "../../queries/AssetBalanceWithUsdValue.hook";
import { useState } from "react";

export const useMutateWithdrawMorphoVault = (vaultAddress?: Address) => {
  /* ------------- */
  /*   Local state */
  /* ------------- */
  const [isSimulating, setIsSimulating] = useState(false);

  /* ------------- */
  /*   Meta data   */
  /* ------------- */
  const account = useAccount();
  const { address } = account;
  const { bundler } = getMorphoChainAddresses(ChainId.BaseMainnet);
  const { showNotification } = useNotificationContext();

  /* ------------- */
  /*   Vault data  */
  /* ------------- */
  const { data: fullVaultData } = useFetchRawFullVaultInfo(vaultAddress);

  /* -------------------- */
  /*   Query cache keys   */
  /* -------------------- */
  const { queryKeys: accountAssetBalanceQK } = useFetchAssetBalance(fullVaultData?.vaultByAddress.address);

  /* ----------------- */
  /*   Mutation config */
  /* ----------------- */
  const { sendTransactionAsync, ...rest } = useSeamlessSendTransaction({
    // array of query keys to invalidate, when mutation happens!
    queriesToInvalidate: [
      ...((accountAssetBalanceQK ?? []) as QueryKey[]),
      getFormattedAssetBalanceUsdValueQueryKey(address, fullVaultData?.vaultByAddress.address),
    ],
    hideDefaultErrorOnNotification: true,
  });

  /* -------------------- */
  /*   Mutation wrapper   */
  /* -------------------- */
  const withdrawAsync = async (
    // ui arguments
    args: {
      amount: bigint | undefined;
    },
    settings?: SeamlessWriteAsyncParams
  ) => {
    try {
      setIsSimulating(true);
      if (!vaultAddress) throw new Error("Vault address is not found. Please try again later.");
      if (!args.amount) throw new Error("Amount is not defined. Please ensure the amount is greater than 0.");
      if (!address) throw new Error("Account address is not found. Please try again later.");

      const simulationState = await fetchSimulationState({
        marketIds: fullVaultData?.vaultByAddress?.state?.allocation?.map((alloc) => alloc.market.uniqueKey) ?? [],
        users: [address, bundler, vaultAddress],
        tokens: [fullVaultData?.vaultByAddress.asset.address, vaultAddress],
        vaults: [vaultAddress],
      });
      if (!simulationState) throw new Error("Simulation failed. Please try again later.");

      const txs = await setupBundle(account, simulationState, [
        {
          type: "MetaMorpho_Withdraw",
          sender: address as Address,
          address: vaultAddress,
          args: {
            shares: args.amount,
            owner: address as Address,
            receiver: address as Address,
            slippage: DEFAULT_SLIPPAGE_TOLERANCE,
          },
        },
      ]);

      for (const tx of txs) {
        await sendTransactionAsync(
          {
            to: bundler,
            data: tx.data as any,
          },
          { ...settings }
        );
      }
    } catch (error) {
      console.error("Failed to withdraw from a vault", error);
      showNotification({
        status: "error",
        content: `Failed to withdraw from a vault: ${getParsedError(error)}`,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return { ...rest, isWithdrawPending: rest.isPending || isSimulating, withdrawAsync };
};