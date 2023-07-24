import { Trans } from '@lingui/macro';

const RefundableDepositTooltipContent = () => {
  return (
    <>
      <Trans>
        This amount of ADA will be held to build a transaction and will be
        returned when your order is executed or cancelled.
      </Trans>
    </>
  );
};

export default RefundableDepositTooltipContent;
