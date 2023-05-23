import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';

import { FeesView } from '../../../../../components/FeesView/FeesView';
import { RemoveLiquidityFormModel } from '../../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { CardanoAmmPool } from '../../../api/ammPools/CardanoAmmPool';
import { useRedeemTxInfo } from '../../common/useRedeemTxInfo';

export interface RedeemConfirmationInfoProps {
  readonly value: RemoveLiquidityFormModel;
  readonly pool: CardanoAmmPool;
}

export const RedeemConfirmationInfo: FC<RedeemConfirmationInfoProps> = ({
  value,
  pool,
}) => {
  const [redeemTxInfo, isRedeemTxInfoLoading] = useRedeemTxInfo(value, pool);

  return (
    <Flex col>
      <FeesView
        feeItems={[{ caption: t`Network Fee`, fee: redeemTxInfo?.txFee }]}
        executionFee={redeemTxInfo?.exFee}
        refundableDeposit={redeemTxInfo?.refundableDeposit}
        isLoading={isRedeemTxInfoLoading}
      />
    </Flex>
  );
};
