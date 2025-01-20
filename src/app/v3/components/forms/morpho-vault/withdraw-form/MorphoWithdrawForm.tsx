import { useForm } from "react-hook-form";
import { FormButtons } from "./FormButtons";
import { useNotificationContext, FlexCol, Typography, WatchAssetComponentv2, MyFormProvider } from "@shared";
import { parseUnits } from "viem";
import { useFormSettingsContext } from "../../contexts/useFormSettingsContext";
import { useFetchFormattedFullVaultInfo } from "../../../../../statev3/morpho/full-vault-info/FullVaultInfo.hook";
import { MappedVaultData } from "../../../../../statev3/morpho/types/MappedFullVaultData";
import { RHFWithdrawVaultAmountField } from "./RHFWithdrawVaultAmountField";
import { useMutateWithdrawMorphoVault } from "../../../../../statev3/morpho/mutations/useMutateWithdrawMorphoVault";

export const MorphoWithdrawForm = () => {
  const { strategy: vault } = useFormSettingsContext();
  const { data: vaultData } = useFetchFormattedFullVaultInfo(vault);

  if (!vaultData) {
    // eslint-disable-next-line no-console
    console.warn("Vault not found!!!");
    return <div className="min-h-[1000px]" />;
  }

  return <MoprhoVaultFormLocal vaultData={vaultData} />;
};

interface FormData {
  amount: string;
  receiveAmount: string;
}

const MoprhoVaultFormLocal: React.FC<{
  vaultData: MappedVaultData;
}> = ({ vaultData }) => {
  const { onTransaction } = useFormSettingsContext();
  const { decimals: underlyingAssetDecimals, symbol: underlyingAssetSymbol } = vaultData.asset;

  const methods = useForm<FormData>({
    defaultValues: {
      amount: "",
      receiveAmount: "",
    },
  });
  const { handleSubmit, reset, watch } = methods;
  const amount = watch("amount", "");

  const { showNotification } = useNotificationContext();

  const { withdrawAsync, isWithdrawPending } = useMutateWithdrawMorphoVault(vaultData.vaultAddress);

  const onSubmitAsync = async (data: FormData) => {
    await withdrawAsync(
      {
        amount: underlyingAssetDecimals ? parseUnits(data.amount, underlyingAssetDecimals) : undefined,
      },
      {
        onSuccess: (txHash) => {
          showNotification({
            txHash,
            content: (
              <FlexCol className="w-full items-center text-center justify-center">
                <Typography>
                  You Withdrew {data.amount} {underlyingAssetSymbol}
                </Typography>
                {vaultData && <WatchAssetComponentv2 {...vaultData} address={vaultData?.vaultAddress} />}
              </FlexCol>
            ),
          });
        },
        onSettled: () => {
          onTransaction?.();
          reset();
        },
      }
    );
  };

  return (
    <MyFormProvider methods={methods} onSubmit={handleSubmit(onSubmitAsync)}>
      <FlexCol className="gap-8">
        <FlexCol className="gap-6">
          <FlexCol className="gap-3">
            <Typography type="medium3">Withdraw</Typography>
            <RHFWithdrawVaultAmountField vault={vaultData.vaultAddress} name="amount" />
          </FlexCol>
        </FlexCol>

        <FormButtons amount={Number(amount)} isDisabled={isWithdrawPending} isLoading={isWithdrawPending} />
      </FlexCol>
    </MyFormProvider>
  );
};
