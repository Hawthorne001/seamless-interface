import { FlexRow, Typography, FlexCol, DisplayTokenAmount, StandardTooltip } from "@shared";
import { useFormSettingsContext } from "../contexts/useFormSettingsContext";
import { DataRow } from "../DataRow";
import { useAccount } from "wagmi";
import { useFetchPreviewDepositCostInUsdAndUnderlying } from "../../../../state/loop-strategy/hooks/useFetchDepositCostInUsdAndUnderlying";
import { checkAuthentication } from "../../../../utils/authenticationUtils";
import { AssetApy } from "../../../../v2/components/asset-data/AssetApy";

export const Summary: React.FC<{
  debouncedAmount: string;
}> = ({ debouncedAmount }) => {
  return <SummaryLocal debouncedAmount={debouncedAmount} />;
};

const SummaryLocal: React.FC<{ debouncedAmount: string }> = ({ debouncedAmount }) => {
  const { isConnected } = useAccount();
  const { strategy } = useFormSettingsContext();

  // todo: refactor useFetchPreviewDepositCostInUsdAndUnderlying to accept strategy, not substrategy..
  const { data: costData, ...restCost } = useFetchPreviewDepositCostInUsdAndUnderlying(debouncedAmount, strategy);

  return (
    <FlexCol className="rounded-card bg-background-selected p-6 gap-4 cursor-default">
      <Typography type="bold3">Summary</Typography>

      <FlexRow className="text-navy-600 justify-between">
        <Typography type="bold2">Estimated Total APY</Typography>
        {strategy && <AssetApy asset={strategy} subStrategy={strategy} isStrategy className="text-navy-1000" />}
      </FlexRow>

      <DataRow
        label={
          <FlexRow className="md:gap-1 items-center">
            3rd party DEX fees
            <StandardTooltip width={1}>
              <Typography type="medium2" className="text-navy-1000">
                DEX fees and price impact incurred to keep the strategy <br /> at the target multiple after your
                deposit. If transaction cost <br /> is high, try depositing smaller amounts over time.
              </Typography>
            </StandardTooltip>
          </FlexRow>
        }
      >
        <DisplayTokenAmount
          {...restCost}
          {...costData?.cost.dollarAmount}
          symbolPosition="before"
          {...checkAuthentication(isConnected)}
        />
      </DataRow>
    </FlexCol>
  );
};