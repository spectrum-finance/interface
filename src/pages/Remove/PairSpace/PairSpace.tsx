import React from 'react';

import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { Currency } from '../../../services/new/currency';
import { RemoveFormSpaceWrapper } from '../RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface PairSpaceProps {
  readonly title: string;
  readonly xAmount: Currency;
  readonly yAmount: Currency;
  readonly fees?: boolean;
}

const PairSpace: React.FC<PairSpaceProps> = ({
  title,
  xAmount,
  yAmount,
  fees,
}): JSX.Element => {
  return (
    <RemoveFormSpaceWrapper title={title}>
      <Box contrast padding={4}>
        <Flex direction="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" align="center">
              <Flex.Item>
                <Flex align="center">
                  <Flex.Item marginRight={2}>
                    <TokenIcon name={xAmount.asset.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>
                      {xAmount.asset.name}
                    </Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? undefined : xAmount.toString({ suffix: false })}
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
                    <TokenIcon name={yAmount.asset.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>
                      {yAmount.asset.name}
                    </Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? undefined : yAmount.toString({ suffix: false })}
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
