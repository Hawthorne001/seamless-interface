import { FlexCol, FlexRow, PageContainer } from "@shared";
import { useNavigate, useParams } from "react-router-dom";
import { Address } from "viem";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { CurrentHoldings } from "../../components/current-holdings/CurrentHoldings";
import { useFetchLeverageTokenByAddress } from "../../../data/leverage-tokens/queries/leverage-token-by-address/FetchLeverageTokenByAddress";
import { LeverageTokenStats } from "./components/stats/LeverageTokenStats";
import { LeverageTokenHeading } from "./components/heading/LeverageTokenHeading";
import { LeverageTokenDetails } from "./components/details-section/LeverageTokenDetails";
import { LeverageTokenFormProvider } from "../../components/forms/leverage-token-form/leverage-token-form-provider/LeverageTokenFormProvider";
import { FormContainer } from "./components/form/FormContainer";
import { CollateralVsValueGraphComponent } from "./components/graphs/CollateralPriceTokenValueGraphComponents";
import { LeverageTokenStatsAdditional } from "./components/stats-additional/LeverageTokenStatsAdditional";
import { LinksAdditional } from "./components/links-additional/LinksAdditional";
import { AllTimeComponent } from "./components/current-holdings/AllTimeComponent";

export const LeverageTokenDetailsPage = () => {
  const navigate = useNavigate();
  const { address } = useParams();
  const { isConnected } = useAccount();

  const { data: lvrgToken, ...rest } = useFetchLeverageTokenByAddress(address as Address);

  return (
    <PageContainer className="flex justify-center py-6 pb-12 px-4 md:px-0">
      <FlexCol className="gap-1 w-full md:max-w-page-content">
        <FlexRow className="py-6 items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={40} height={40} />
          </button>
        </FlexRow>

        <div className="mb-8">
          <LeverageTokenHeading
            leverageToken={{
              data: lvrgToken,
              ...rest,
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 w-full items-start">
          <div className="md:sticky top-6 order-1 md:order-2 md:min-w-[460px]">
            <LeverageTokenFormProvider>
              <FormContainer />
            </LeverageTokenFormProvider>
          </div>

          <div className="flex flex-col gap-10 order-2 md:order-1">
            {isConnected && (
              <CurrentHoldings
                address={address as Address}
                userProfitComponent={<AllTimeComponent address={lvrgToken?.address} />}
              />
            )}

            <LeverageTokenStats leverageToken={{ data: lvrgToken, ...rest }} />

            <FlexCol className="px-8 py-6 w-full rounded-xl bg-neutral-0 gap-4">
              <CollateralVsValueGraphComponent
                tokenAddress={lvrgToken?.address}
                collateralSymbol={lvrgToken?.collateralAssetTokenData?.symbol}
                debtSymbol={lvrgToken?.debtAssetTokenData?.symbol}
              />
            </FlexCol>

            <LinksAdditional address={lvrgToken?.address} />

            <LeverageTokenStatsAdditional tokenAddress={lvrgToken?.address} />

            <LeverageTokenDetails tokenAddress={lvrgToken?.address} />
          </div>
        </div>
      </FlexCol>
    </PageContainer>
  );
};
