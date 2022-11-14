import { Button, Flex, Modal } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { FC, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { first } from 'rxjs';

import { panalytics } from '../../../../common/analytics';
import { TxId } from '../../../../common/types';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { PageSection } from '../../../../components/Page/PageSection/PageSection';
import { Section } from '../../../../components/Section/Section';
import { AddLiquidityFormModel } from '../../../../pages/AddLiquidityOrCreatePool/AddLiquidity/AddLiquidityFormModel';
import { PoolRatio } from '../../../../pages/PoolOverview/PoolRatio/PoolRatio';
import { ergopayDeposit } from '../../operations/deposit/ergopayDeposit';
import { DepositConfirmationInfo } from '../DepositConfirmationModal/DepositConfirmationInfo/DepositConfirmationInfo';

export interface DepositOpenWalletProps {
  readonly value: Required<AddLiquidityFormModel>;
  readonly onTxRegister: (p: TxId) => void;
}

export const DepositOpenWallet: FC<DepositOpenWalletProps> = ({
  value,
  onTxRegister,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const addLiquidityOperation = async () => {
    if (value.pool && value.x && value.y) {
      panalytics.confirmDeposit(value);
      setLoading(true);
      ergopayDeposit(value.pool as any, value.x, value.y)
        .pipe(first())
        .subscribe({
          next: (txId) => {
            setLoading(false);
            onTxRegister(txId);
          },
          error: () => setLoading(false),
        });
    }
  };

  return (
    <>
      <Modal.Title>
        <Trans>Confirm Add Liquidity</Trans>
      </Modal.Title>
      <Modal.Content width={468}>
        <Flex direction="col">
          <Flex.Item marginBottom={6}>
            <FormPairSection
              title={t`Assets`}
              xAmount={value.x}
              yAmount={value.y}
            />
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <Section title={t`Initial price`} gap={2}>
              <Flex>
                <Flex.Item flex={1} marginRight={2}>
                  <PoolRatio ammPool={value.pool} ratioOf="x" />
                </Flex.Item>
                <Flex.Item flex={1}>
                  <PoolRatio ammPool={value.pool} ratioOf="y" />
                </Flex.Item>
              </Flex>
            </Section>
          </Flex.Item>
          <Flex.Item marginBottom={6}>
            <PageSection title={t`Fees`}>
              <DepositConfirmationInfo />
            </PageSection>
          </Flex.Item>
          <Flex.Item>
            <Button
              onClick={() => addLiquidityOperation()}
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
      </Modal.Content>
    </>
  );
};
