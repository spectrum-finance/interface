import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { FeesView } from '../../../../../components/FeesView/FeesView';
import { AddLiquidityFormModel } from '../../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { useDepositTxInfo } from '../../common/useDepositTxInfo';

export interface DepositConfirmationInfoProps {
  readonly value: AddLiquidityFormModel;
}

export const DepositConfirmationInfo: FC<DepositConfirmationInfoProps> = ({
  value,
}) => {
  const [depositTxInfo, isDepositTxInfoLoading] = useDepositTxInfo(value);

  return (
    <Flex col>
      <FeesView
        feeItems={[{ caption: t`Network Fee`, fee: depositTxInfo?.txFee }]}
        executionFee={depositTxInfo?.exFee}
        isLoading={isDepositTxInfoLoading}
        refundableDeposit={depositTxInfo?.refundableDeposit}
      />
    </Flex>
  );
};
