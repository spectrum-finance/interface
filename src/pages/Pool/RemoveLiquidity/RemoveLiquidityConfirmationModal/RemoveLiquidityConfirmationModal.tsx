import { minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import { BoxSelection, DefaultBoxSelector } from '@ergolabs/ergo-sdk';
import React from 'react';

import { ERG_DECIMALS, UI_FEE } from '../../../../common/constants/erg';
import { useObservable } from '../../../../common/hooks/useObservable';
import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { FormFeesSection } from '../../../../components/common/FormView/FormFeesSection/FormFeesSection';
import { FormPairSection } from '../../../../components/common/FormView/FormPairSection/FormPairSection';
import { useSettings } from '../../../../context';
import { Box, Button, Flex, Modal } from '../../../../ergodex-cdk';
import { utxos$ } from '../../../../network/ergo/common/utxos';
import { explorer } from '../../../../services/explorer';
import { useMinExFee, useMinTotalFees } from '../../../../services/new/core';
import { poolActions } from '../../../../services/poolActions';
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
      const actions = poolActions(pool['pool']);
      const lpToRemove = pool['pool'].lp.withAmount(lpAmount.amount);

      const poolId = pool.id;

      const network = await explorer.getNetworkContext();

      const minFeeForOrder = minValueForOrder(
        minerFeeNErgs,
        uiFeeNErg,
        exFeeNErg,
      );

      const target = makeTarget([lpToRemove], minFeeForOrder);

      const inputs = DefaultBoxSelector.select(utxos!, target) as BoxSelection;

      if (address && pk) {
        onClose(
          actions
            .redeem(
              {
                poolId,
                pk,
                lp: lpToRemove,
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
        <Modal.Title>Confirm Remove Liquidity</Modal.Title>
        <Modal.Content width={436}>
          <Box transparent>
            <Flex direction="col">
              <Flex.Item marginBottom={6}>
                <FormPairSection
                  title="Pooled assets"
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
                  Remove Liquidity
                </Button>
              </Flex.Item>
            </Flex>
          </Box>
        </Modal.Content>
      </>
    );
  };
