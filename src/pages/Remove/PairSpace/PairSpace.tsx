import React from 'react';

import { TokenIcon } from '../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Typography } from '../../../ergodex-cdk';
import { Currency } from '../../../services/new/currency';
import { RemoveFormSpaceWrapper } from '../RemoveFormSpaceWrapper/RemoveFormSpaceWrapper';

interface PairSpaceProps {
  readonly title: string;
  readonly amountX: Currency;
  readonly amountY: Currency;
  readonly fees?: boolean;
}

const PairSpace: React.FC<PairSpaceProps> = ({
  title,
  amountX,
  amountY,
  fees,
}): JSX.Element => {
  console.log(amountX, amountY);
  return (
    <RemoveFormSpaceWrapper title={title}>
      <Box contrast padding={4}>
        <Flex direction="col">
          <Flex.Item marginBottom={2}>
            <Flex justify="space-between" align="center">
              <Flex.Item>
                <Flex align="center">
                  <Flex.Item marginRight={2}>
                    <TokenIcon name={amountX.asset.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>
                      {amountX.asset.name}
                    </Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? undefined : amountX.toString({ suffix: false })}
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
                    <TokenIcon name={amountY.asset.name} />
                  </Flex.Item>
                  <Flex.Item>
                    <Typography.Body strong>
                      {amountY.asset.name}
                    </Typography.Body>
                  </Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item>
                <Flex>
                  <Typography.Body strong>
                    {fees ? undefined : amountY.toString({ suffix: false })}
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
