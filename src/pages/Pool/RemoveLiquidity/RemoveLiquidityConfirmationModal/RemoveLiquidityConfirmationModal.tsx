import { t, Trans } from '@lingui/macro';
import React from 'react';
import { Observable } from 'rxjs';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { TxId } from '../../../../common/types';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Box, Button, Flex, Modal } from '../../../../ergodex-cdk';
import { redeem } from '../../../../gateway/api/operations/redeem';
import { useMinExFee, useMinTotalFees } from '../../../../services/new/core';

// import { poolActions } from '../../../../services/poolActions';
interface ConfirmRemoveModalProps {
  onClose: (p: Observable<TxId>) => void;
  pool: AmmPool;
  lpAmount: Currency;
  xAmount: Currency;
  yAmount: Currency;
}

export const RemoveLiquidityConfirmationModal: React.FC<ConfirmRemoveModalProps> =
  ({ pool, lpAmount, xAmount, yAmount, onClose }) => {
    const [{ minerFee }] = useSettings();
    const minExFee = useMinExFee();
    const totalFees = useMinTotalFees();

    // TODO: add try catch
    const removeOperation = async (pool: AmmPool, lpAmount: Currency) => {
      if (pool && lpAmount) {
        onClose(redeem(pool, lpAmount));
      }
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
                  xAmount={xAmount}
                  yAmount={yAmount}
                />
              </Flex.Item>
              <Flex.Item marginBottom={6}>
                <FormFeesSection
                  minerFee={minerFee}
                  minExFee={minExFee}
                  totalFees={totalFees}
                />
              </Flex.Item>
              <Flex.Item>
                <Button
                  block
                  type="primary"
                  size="large"
                  onClick={() => removeOperation(pool, lpAmount)}
                >
                  <Trans>Remove Liquidity</Trans>
                </Button>
              </Flex.Item>
            </Flex>
          </Box>
        </Modal.Content>
      </>
    );
  };
