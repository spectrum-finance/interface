import { minValueForOrder } from '@ergolabs/ergo-dex-sdk';
import { BoxSelection, DefaultBoxSelector } from '@ergolabs/ergo-sdk';
import React from 'react';

import { AmmPool } from '../../../common/models/AmmPool';
import { Currency } from '../../../common/models/Currency';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, UI_FEE } from '../../../constants/erg';
import { defaultExFee } from '../../../constants/settings';
import { useSettings } from '../../../context';
import {
  Box,
  Button,
  Flex,
  message,
  Modal,
  Typography,
} from '../../../ergodex-cdk';
import { useUTXOs } from '../../../hooks/useUTXOs';
import { explorer } from '../../../services/explorer';
import { poolActions } from '../../../services/poolActions';
import { submitTx } from '../../../services/yoroi';
import { makeTarget } from '../../../utils/ammMath';
import { parseUserInputToFractions } from '../../../utils/math';
import { calculateTotalFee } from '../../../utils/transactions';
import { PairSpace } from '../PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from '../RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface ConfirmRemoveModalProps {
  onClose: (p: Promise<any>) => void;
  pool: AmmPool;
  lpToRemove: number;
  xAmount: Currency;
  yAmount: Currency;
}

const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({
  pool,
  lpToRemove,
  xAmount,
  yAmount,
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

  const removeOperation = async (pool: AmmPool) => {
    const actions = poolActions(pool['pool']);
    const lp = pool['pool'].lp.withAmount(BigInt(lpToRemove.toFixed(0)));

    const poolId = pool.id;

    try {
      const network = await explorer.getNetworkContext();

      const inputs = DefaultBoxSelector.select(
        UTXOs,
        makeTarget([lp], minValueForOrder(minerFeeNErgs, uiFeeNErg, exFeeNErg)),
      ) as BoxSelection;

      if (address && pk) {
        onClose(
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
    } catch (err) {
      message.error('Network connection issue');
    }
  };

  return (
    <>
      <Modal.Title>Confirm Remove Liquidity</Modal.Title>
      <Modal.Content width={436}>
        <Box transparent>
          <Flex direction="col">
            <Flex.Item marginBottom={6}>
              <PairSpace
                title="Pooled assets"
                xAmount={xAmount}
                yAmount={yAmount}
              />
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
                          <Flex direction="col">
                            <Flex.Item>
                              <Flex>
                                <Flex.Item marginRight={1}>
                                  Miner Fee:
                                </Flex.Item>
                                <Flex.Item>{minerFee} ERG</Flex.Item>
                              </Flex>
                            </Flex.Item>
                            <Flex.Item>
                              <Flex>
                                <Flex.Item marginRight={1}>
                                  Execution Fee:
                                </Flex.Item>
                                <Flex.Item>{defaultExFee} ERG</Flex.Item>
                              </Flex>
                            </Flex.Item>
                            {!!UI_FEE && (
                              <Flex.Item>
                                <Flex>
                                  <Flex.Item marginRight={1}>UI Fee:</Flex.Item>
                                  <Flex.Item>{UI_FEE} ERG</Flex.Item>
                                </Flex>
                              </Flex.Item>
                            )}
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

export { ConfirmRemoveModal };
