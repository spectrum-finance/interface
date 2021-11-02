import { AmmPool, minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import {
  AssetAmount,
  BoxSelection,
  DefaultBoxSelector,
  ergoTxToProxy,
} from '@ergolabs/ergo-sdk';
import React from 'react';

import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, UI_FEE } from '../../../constants/erg';
import { defaultExFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import { Box, Button, Flex, Typography } from '../../../ergodex-cdk';
import { useUTXOs } from '../../../hooks/useUTXOs';
import { explorer as network } from '../../../services/explorer';
import { poolActions } from '../../../services/poolActions';
import { makeTarget } from '../../../utils/ammMath';
import {
  parseUserInputToFractions,
  renderFractions,
} from '../../../utils/math';
import { calculateTotalFee } from '../../../utils/transactions';
import { PairSpace } from '../PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from '../RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';
import { RemovableAssetPair } from '../types';

interface ConfirmRemoveModalProps {
  onClose: () => void;
  position: AmmPool;
  lpToRemove: AssetAmount;
  pair: RemovableAssetPair;
}

const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({
  position,
  lpToRemove,
  pair,
  onClose,
}) => {
  const UTXOs = useUTXOs();
  const [{ minerFee, address, pk }] = useSettings();

  const uiFeeNErg = parseUserInputToFractions(UI_FEE, ERG_DECIMALS);
  const exFeeNErg = parseUserInputToFractions(defaultExFee, ERG_DECIMALS);
  const minerFeeNErgs = parseUserInputToFractions(minerFee, ERG_DECIMALS);

  const totalFees = calculateTotalFee(
    [minerFee, UI_FEE, defaultExFee],
    ERG_DECIMALS,
  );

  const removeOperation = async (position: AmmPool, lp: AssetAmount) => {
    const actions = poolActions(position);

    const poolId = position.id;

    if (address && pk) {
      actions
        .redeem(
          {
            poolId,
            pk,
            lp,
            exFee: exFeeNErg,
            uiFee: uiFeeNErg,
          },
          {
            inputs: DefaultBoxSelector.select(
              UTXOs,
              makeTarget(
                [lp],
                minValueForOrder(minerFeeNErgs, uiFeeNErg, exFeeNErg),
              ),
            ) as BoxSelection,
            changeAddress: address,
            selfAddress: address,
            feeNErgs: minerFeeNErgs,
            network: await network.getNetworkContext(),
          },
        )
        .then(async (tx) => {
          await ergo.submit_tx(ergoTxToProxy(tx));
        })
        // TODO: HANDLE_ERROR_STATE_WITH_MODAL_CHAINING[EDEX-466]
        .catch((err) => console.log(err))
        .finally(() => onClose());
    }
  };

  return (
    <Box transparent>
      <Flex flexDirection="col">
        <Flex.Item marginBottom={6}>
          <PairSpace title="Pooled assets" pair={pair} />
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
                            <Flex.Item>
                              {renderFractions(UI_FEE, ERG_DECIMALS)} ERG
                            </Flex.Item>
                          </Flex>
                        </Flex.Item>
                      </Flex>
                    }
                  />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Text strong>{totalFees}</Typography.Text>
                </Flex.Item>
              </Flex>
            </Box>
          </RemoveFormSpaceWrapper>
        </Flex.Item>
        <Flex.Item>
          <Button
            block
            type="primary"
            size="large"
            onClick={() => removeOperation(position, lpToRemove)}
          >
            Remove liquidity
          </Button>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export { ConfirmRemoveModal };
