import { DisplayPercentage, FlexRow, Tooltip, Icon, ViewNumber } from "@shared";
import { ViewRewardToken } from "../../v1/pages/ilm-page/hooks/useFetchViewBaseAsset";

interface IncentivesButtonProps {
  totalApr?: ViewNumber;
  rewardTokens?: ViewRewardToken[];
  children: React.ReactNode;
}

export const IncentivesButton: React.FC<IncentivesButtonProps> = ({ totalApr, rewardTokens, children }) => {
  return (
    <Tooltip tooltip={children}>
      <FlexRow className="items-center gap-2 border border-solid px-2 py-1.5 rounded-[100px]">
        <FlexRow className="object-cover ">
          {rewardTokens?.map((rewardToken, index) => {
            return (
              <Icon
                key={index}
                className={index > 0 ? "-ml-1 w-4 h-4" : "w-4 h-4"}
                src={rewardToken.logo}
                alt="reward-token-logo"
              />
            );
          })}
        </FlexRow>
        <DisplayPercentage {...totalApr} typography="medium2" />
      </FlexRow>
    </Tooltip>
  );
};