import React from "react";
import { MyFormProvider, FlexCol, Typography } from "@shared";
import { RHFWithdrawStrategyAmountField } from "./RHFWithdrawLeverageTokenAmountField";
import { RHFReceiveAmountField } from "./RHFReceiveAmountField";
import { Summary } from "./Summary";
import { FormButtons } from "./FormButtons";
import { useLeverageTokenFormContext } from "../leverage-token-form-provider/LeverageTokenFormProvider";
import { EmptyFormGuard } from "../../../../pages/common/components/EmptyFormGuard";

export const WithdrawLeverageTokenForm: React.FC = () => {
  const { reactHookFormMethods, formOnSubmitAsync, selectedLeverageToken } = useLeverageTokenFormContext();

  const onSubmit = async () => {
    await formOnSubmitAsync({});
  };

  return (
    <EmptyFormGuard errorSource="WithdrawLeverageTokenForm" data={{ ...selectedLeverageToken }}>
      <MyFormProvider methods={reactHookFormMethods} onSubmit={reactHookFormMethods.handleSubmit(onSubmit)}>
        <FlexCol className="gap-4">
          <FlexCol className="gap-2">
            <Typography type="medium3">Redeem</Typography>
            <RHFWithdrawStrategyAmountField name="withdrawAmount" />
          </FlexCol>

          <FlexCol className="gap-2">
            <Typography type="medium3">Burn</Typography>
            <RHFReceiveAmountField name="receiveAmount" />
          </FlexCol>

          <Summary />

          <FormButtons />
        </FlexCol>
      </MyFormProvider>
    </EmptyFormGuard>
  );
};
