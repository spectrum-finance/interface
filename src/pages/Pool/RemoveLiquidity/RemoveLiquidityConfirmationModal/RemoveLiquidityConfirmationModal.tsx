import { minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import { BoxSelection, DefaultBoxSelector } from '@ergolabs/ergo-sdk';
import { t, Trans } from '@lingui/macro';
import React from 'react';

import { ERG_DECIMALS, UI_FEE } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Box, Button, Flex, Modal } from '../../../../ergodex-cdk';
import { utxos$ } from '../../../../network/ergo/api/utxos/utxos';
import { explorer } from '../../../../services/explorer';
import { useMinExFee, useMinTotalFees } from '../../../../services/new/core';
import { poolActions } from '../../../../services/poolActions';
// import { poolActions } from '../../../../services/poolActions';
import { submitTx } from '../../../../services/yoroi';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
interface ConfirmRemoveModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  lpAmount: Currency;
  xAmount: Currency;
  yAmount: Currency;
}

export const RemoveLiquidityConfirmationModal: React.FC<ConfirmRemoveModalProps> =
  ({ pool, lpAmount, xAmount, yAmount, onClose }) => {
    const [utxos] = useObservable(utxos$);
    const [{ minerFee, address, pk }] = useSettings();
    const minExFee = useMinExFee();
    const totalFees = useMinTotalFees();

    const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
    const exFeeNErg = minExFee.amount;
    const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

    // TODO: add try catch
    const removeOperation = async (pool: AmmPool) => {
      const actions = poolActions(pool['pool'] as any);
      const lpToRemove = pool['pool'].lp.withAmount(lpAmount.amount);

      const poolId = pool.id;

      const network = await explorer.getNetworkContext();

      const minFeeForOrder = minValueForOrder(
        minerFeeNErgs,
        uiFeeNErg,
        exFeeNErg,
      );

      const target = makeTarget([lpToRemove as any], minFeeForOrder);

      const inputs = DefaultBoxSelector.select(utxos!, target) as BoxSelection;

      if (address && pk) {
        onClose(
          actions
            .redeem(
              {
                poolId,
                pk,
                lp: lpToRemove as any,
                exFee: exFeeNErg,
                uiFee: uiFeeNErg,
              },
              {
                inputs,
                changeAddress: address,
                selfAddress: address,
                feeNErgs: minerFeeNErgs,
                network,
              },
            )
            .then((tx) => submitTx(tx)),
        );
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
                  onClick={() => removeOperation(pool)}
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
