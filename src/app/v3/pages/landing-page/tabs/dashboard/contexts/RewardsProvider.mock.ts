import seamIcon from "@assets/tokens/seam.svg";
import usdcIcon from "@assets/tokens/usdc.svg";
import { type RewardItem } from "./RewardsProvider";

const MockTokenAmount = {
  bigIntValue: 10n,
  viewValue: "453.32",
  symbol: "SEAM",
};
const MockTokenAmount2 = {
  bigIntValue: 10n,
  viewValue: "32.32",
  symbol: "SEAM",
};
const MockDollarAmount = {
  bigIntValue: 10n,
  viewValue: "453.32",
  symbol: "$",
};

export const REWARDS_MOCK_ITEMS: RewardItem[] = [
  {
    id: "1",
    icon: seamIcon,
    name: "stkSEAM rewards",
    description: "Staking rewards and fees",
    dollarAmount: MockDollarAmount,
    rewards: [
      {
        tokenAmount: MockTokenAmount,
        dollarAmount: MockDollarAmount,
        logo: seamIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount2,
        dollarAmount: MockTokenAmount2,
        logo: usdcIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount,
        dollarAmount: MockTokenAmount,
        logo: seamIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount2,
        dollarAmount: MockTokenAmount2,
        logo: usdcIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount,
        dollarAmount: MockTokenAmount,
        logo: seamIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount2,
        dollarAmount: MockTokenAmount2,
        logo: usdcIcon,
        address: "0x123",
      },
    ],
  },
  {
    id: "2",
    icon: seamIcon,
    name: "Morpho vault",
    description: "Vault earnings",
    dollarAmount: MockDollarAmount,
    rewards: [
      {
        tokenAmount: MockTokenAmount,
        dollarAmount: MockDollarAmount,
        logo: seamIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount,
        dollarAmount: MockDollarAmount,
        logo: seamIcon,
        address: "0x123",
      },
      {
        tokenAmount: MockTokenAmount2,
        dollarAmount: MockDollarAmount,
        logo: usdcIcon,
        address: "0x123",
      },
    ],
  },
];
