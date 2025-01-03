import { FlexCol, FlexRow, PageContainer } from "@shared";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { RouterConfig } from "@router";

import { MorphoVaultStats } from "./components/MorphoVaultStats";

export const MorphoVaultDetails = () => {
  const navigate = useNavigate();

  return (
    <PageContainer className="flex justify-center py-6 pb-12 px-4 md:px-0">
      <FlexCol className="gap-1 w-full md:max-w-page-content">
        <FlexRow className="py-6 items-center gap-4">
          <button onClick={() => navigate(`${RouterConfig.Routes.landingPage}/?tab=Vaults`)}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
          {/* <StrategyPickerButton strategy={address as Address} /> */}
        </FlexRow>

        <div>
          <div className="mb-8">{/* <StrategyHeading /> */}</div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 w-full items-start">
            <div className="md:sticky top-6 order-1 md:order-2 md:min-w-[460px]">{/* <FormContainer /> */}</div>

            <div className="flex flex-col gap-10 order-2 md:order-1">
              {/* {isConnected && <CurrentHoldings />} */}
              {/* <GraphComponent /> */}
              <MorphoVaultStats />
              {/* <StrategyDetails /> */}
            </div>
          </div>
        </div>
      </FlexCol>
    </PageContainer>
  );
};
