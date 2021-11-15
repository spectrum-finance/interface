import { AmmPool, minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import { BoxSelection, DefaultBoxSelector, ErgoTx } from '@ergolabs/ergo-sdk';
import React from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, UI_FEE } from '../../../../constants/erg';
import { defaultExFee } from '../../../../constants/settings';
import { useSettings } from '../../../../context';
import { Box, Button, Flex, Typography } from '../../../../ergodex-cdk';
import { useObservable } from '../../../../hooks/useObservable';
import { explorer } from '../../../../services/explorer';
import { utxos$ } from '../../../../services/new/core';
import { poolActions } from '../../../../services/poolActions';
import { submitTx } from '../../../../services/yoroi';
import { makeTarget } from '../../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../../utils/math';
import { calculateTotalFee } from '../../../../utils/transactions';
import { PairSpace } from '../../../Remove/PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from '../../../Remove/RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface ConfirmRemoveModalProps {
  position?: AmmPool;
  pair: AssetPair;
  onClose: (r: Promise<any>) => void;
}

const AddLiquidityConfirmationModal: React.FC<ConfirmRemoveModalProps> = ({
  position,
  pair,
  onClose,
}) => {
  const [{ minerFee, address, pk }] = useSettings();
  const [utxos] = useObservable(utxos$);

  console.log('position >>', position);
  console.log('pair >>', pair);

  const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
  const exFeeNErg = parseUserInputToFractions(defaultExFee, ERG_DECIMALS);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const totalFees = calculateTotalFee(
    [minerFee, UI_FEE, defaultExFee],
    ERG_DECIMALS,
  );

  const addLiquidityOperation = async () => {
    if (position && pk && address && utxos) {
      const poolId = position.id;

      const actions = poolActions(position);

      const inputX = position.x.withAmount(
        parseUserInputToFractions(
          String(pair.assetX.amount),
          position.x.asset.decimals,
        ),
      );
      const inputY = position.y.withAmount(
        parseUserInputToFractions(
          String(pair.assetY.amount),
          position.y.asset.decimals,
        ),
      );

      const target = makeTarget(
        [inputX, inputY],
        minValueForOrder(minerFeeNErgs, uiFeeNErg, exFeeNErg),
      );

      const network = await explorer.getNetworkContext();

      const inputs = DefaultBoxSelector.select(utxos, target) as BoxSelection;

      onClose(
        actions
          .deposit(
            {
              pk,
              poolId,
              exFee: exFeeNErg,
              uiFee: uiFeeNErg,
              x: inputX,
              y: inputY,
            },
            {
              inputs,
              changeAddress: address,
              selfAddress: address,
              feeNErgs: minerFeeNErgs,
              network,
            },
          )
          .then(async (tx: ErgoTx) => {
            return await submitTx(tx);
          }),
      );
    }
  };

  return (
    <Flex flexDirection="col">
      <Flex.Item marginBottom={6}>
        <PairSpace title="Assets" pair={pair} />
      </Flex.Item>
      <Flex.Item marginBottom={6}>
        <RemoveFormSpaceWrapper title="Fees">
          <Box contrast padding={4}>
            <Flex justify="space-between">
              <Flex.Item>
                <Typography.Text strong>Fees</Typography.Text>
                <InfoTooltip
                  placement="rightBottom"
                  content={
                    <Flex flexDirection="col" style={{ width: '200px' }}>
                      <Flex.Item>
                        <Flex justify="space-between">
                          <Flex.Item>Miner Fee:</Flex.Item>
                          <Flex.Item>{minerFee} ERG</Flex.Item>
                        </Flex>
                      </Flex.Item>
                      <Flex.Item>
                        <Flex justify="space-between">
                          <Flex.Item>Execution Fee:</Flex.Item>
                          <Flex.Item>{defaultExFee} ERG</Flex.Item>
                        </Flex>
                      </Flex.Item>
                      <Flex.Item>
                        <Flex justify="space-between">
                          <Flex.Item>UI Fee:</Flex.Item>
                          <Flex.Item>{UI_FEE} ERG</Flex.Item>
                        </Flex>
                      </Flex.Item>
                    </Flex>
                  }
                />
              </Flex.Item>
              <Flex.Item>
                <Typography.Text strong>{totalFees} ERG</Typography.Text>
              </Flex.Item>
            </Flex>
          </Box>
        </RemoveFormSpaceWrapper>
      </Flex.Item>
      <Flex.Item>
        <Button
          block
          type="primary"
          size="extra-large"
          onClick={() => addLiquidityOperation()}
        >
          Add
        </Button>
      </Flex.Item>
    </Flex>
  );
};

export { AddLiquidityConfirmationModal };
