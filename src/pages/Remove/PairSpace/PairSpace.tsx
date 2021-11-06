import React from 'react';

import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { RemoveFormSpaceWrapper } from '../RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface PairSpaceProps {
  title: string;
  pair: AssetPair;
  fees?: boolean;
}

const PairSpace: React.FC<PairSpaceProps> = ({
  title,
  pair,
  fees,
}): JSX.Element => {
  return (
    <RemoveFormSpaceWrapper title={title}>
      <Box contrast padding={4}>
        <Flex flexDirection="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" alignItems="center">
              <Flex.Item>
                <Flex alignItems="center">
                  <Flex.Item marginRight={2}>
                    <TokenIcon name={pair.assetX.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>{pair.assetX.name}</Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? pair.assetX.earnedFees : pair.assetX.amount}
                  </Typography.Body>
                </Flex>
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item>
            <Flex justify="space-between">
              <Flex.Item>
                <Flex>
                  <Flex.Item marginRight={2}>
                    <TokenIcon name={pair.assetY.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>{pair.assetY.name}</Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? pair.assetY.earnedFees : pair.assetY.amount}
                  </Typography.Body>
                </Flex>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </Flex>
      </Box>
    </RemoveFormSpaceWrapper>
  );
};

export { PairSpace };
