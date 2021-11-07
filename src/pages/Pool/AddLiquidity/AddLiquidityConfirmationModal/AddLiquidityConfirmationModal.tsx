import React from 'react';

import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import { ERG_DECIMALS, UI_FEE } from '../../../../constants/erg';
import { defaultExFee } from '../../../../constants/settings';
import { useSettings } from '../../../../context';
import { Box, Button, Flex, Typography } from '../../../../ergodex-cdk';
import { calculateTotalFee } from '../../../../utils/transactions';
import { PairSpace } from '../../../Remove/PairSpace/PairSpace';
import { RemoveFormSpaceWrapper } from '../../../Remove/RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface ConfirmRemoveModalProps {
  pair: AssetPair;
  onClose: () => void;
}

const AddLiquidityConfirmationModal: React.FC<ConfirmRemoveModalProps> = ({
  pair,
  onClose,
}) => {
  const [{ minerFee }] = useSettings();

  const totalFees = calculateTotalFee(
    [minerFee, UI_FEE, defaultExFee],
    ERG_DECIMALS,
  );

  const addLiquidityOperation = () => {
    onClose();
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
          size="large"
          onClick={() => addLiquidityOperation()}
        >
          Add
        </Button>
      </Flex.Item>
    </Flex>
  );
};

export { AddLiquidityConfirmationModal };
