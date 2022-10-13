import { Box, Button, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { first } from 'rxjs';

import { panalytics } from '../../../../common/analytics';
import { TxId } from '../../../../common/types';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { RemoveLiquidityFormModel } from '../../../../pages/RemoveLiquidity/RemoveLiquidityFormModel';
import { ErgoAmmPool } from '../../api/ammPools/ErgoAmmPool';
import { ergopayRedeem } from '../../operations/redeem/ergopayRedeem';
import { ErgoPayCompatibleWalletLink } from '../ErgoPayModal/ErgoPayCompatibleWalletLink/ErgoPayCompatibleWalletLink';
import { RedeemConfirmationInfo } from '../RedeemConfirmationModal/RedeemConfirmationInfo/RedeemConfirmationInfo';

export interface RedeemOpenWalletProps {
  readonly pool: ErgoAmmPool;
  readonly value: Required<RemoveLiquidityFormModel>;
  readonly onTxRegister: (p: TxId) => void;
}

export const RedeemOpenWallet: FC<RedeemOpenWalletProps> = ({
  pool,
  value,
  onTxRegister,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const redeemOperation = async () => {
    panalytics.confirmRedeem(value, pool);
    setLoading(true);
    ergopayRedeem(pool, value.lpAmount, value.xAmount, value.yAmount)
      .pipe(first())
      .subscribe({
        next: (txId) => {
          setLoading(false);
          onTxRegister(txId);
        },
        error: () => setLoading(false),
      });
  };

  return (
    <>
      <Modal.Title>
        <Trans>Confirm Remove Liquidity</Trans>
      </Modal.Title>
      <Modal.Content width={436}>
        <Box transparent bordered={false}>
          <Flex direction="col">
            <Flex.Item marginBottom={6}>
              <FormPairSection
                title={t`Pooled assets`}
                xAmount={value.xAmount}
                yAmount={value.yAmount}
              />
            </Flex.Item>
            <Flex.Item marginBottom={6}>
              <PageSection title={t`Fees`}>
                <RedeemConfirmationInfo />
              </PageSection>
            </Flex.Item>
            <Flex.Item marginBottom={2} alignSelf="center">
              <ErgoPayCompatibleWalletLink />
            </Flex.Item>
            <Flex.Item>
              <Button
                onClick={() => redeemOperation()}
                size="extra-large"
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {isMobile ? t`Open Wallet` : t`Proceed`}
              </Button>
            </Flex.Item>
          </Flex>
        </Box>
      </Modal.Content>
    </>
  );
};
