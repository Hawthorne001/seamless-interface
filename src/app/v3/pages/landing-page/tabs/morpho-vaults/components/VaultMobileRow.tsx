import {
  Typography,
  DisplayMoney,
  DisplayPercentage,
  ImageGroup,
  ViewBigInt,
  DisplayTokenAmount,
  FlexCol,
  FlexRow,
  Icon,
} from "@shared";
import { MorphoAsset } from "../../../../../../statev3/morpho/types/MorphoAsset";
import { Curator } from "../../../../../../statev3/morpho/types/Curator";

interface VaultProps {
  name: string;
  asset: MorphoAsset;
  totalAssetsUsd: string;
  totalSupply: ViewBigInt;
  netApy: string;
  curator?: Curator;
  feePercentage: string;
  collateralLogos: (string | undefined)[];
  selected?: boolean;
}

export const VaultMobileRow: React.FC<VaultProps> = ({
  name,
  asset,
  totalAssetsUsd,
  totalSupply,
  netApy,
  curator,
  feePercentage,
  collateralLogos,
  selected,
}) => {
  return (
    <div
      className={`flex flex-col md:hidden p-4 m-2 bg-white rounded-lg shadow  ${selected ? "bg-neutral-100" : "bg-white"}`}
    >
      <FlexRow className="items-center gap-4 mb-4">
        <Icon width={30} src={asset?.logoURI || ""} alt="Strategy Logo" />
        <FlexCol>
          <Typography type="bold3">{name}</Typography>
          <Typography type="regular1">{asset?.symbol}</Typography>
        </FlexCol>
      </FlexRow>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Typography type="regular1">Total Supply:</Typography>
          <FlexCol className="items-end">
            <DisplayTokenAmount {...totalSupply} typography="bold3" />

            <DisplayMoney typography="medium1" viewValue={totalAssetsUsd} className="text-primary-600" />
          </FlexCol>
        </div>
        <div className="flex justify-between">
          <Typography type="regular1">Net APY:</Typography>
          <DisplayPercentage viewValue={netApy} typography="bold3" />
        </div>
        <div className="flex justify-between">
          <Typography type="regular1">Curator:</Typography>
          <FlexRow className="gap-1">
            <Icon width={8} src={curator?.icon || ""} alt="Curator Logo" />
            <Typography type="bold3">{curator?.name}</Typography>
          </FlexRow>
        </div>
        <div className="flex justify-between">
          <Typography type="regular1">Performance Fee:</Typography>
          <Typography type="bold3">{feePercentage}</Typography>
        </div>
        <div className="flex justify-between items-center">
          <Typography type="regular1">Collateral:</Typography>
          <ImageGroup images={collateralLogos} imageStyle="w-3 h-3 rounded-full" spacing="-space-x-2 " />
        </div>
      </div>
    </div>
  );
};