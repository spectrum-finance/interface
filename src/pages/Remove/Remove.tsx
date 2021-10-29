import React from 'react';

import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { TokenIconPair } from '../../components/TokenIconPair/TokenIconPair';
import {
  Box,
  Button,
  Flex,
  SettingOutlined,
  Typography,
} from '../../ergodex-cdk';

const mocks = {
  tokenPair: { tokenA: 'ERG', tokenB: 'SigUSD' },
};

const Remove = (): JSX.Element => {
  return (
    <FormPageWrapper width={382}>
      <Flex flexDirection="col">
        <Flex.Item marginBottom={2}>
          <Flex justify="space-between" alignItems="center">
            <Flex.Item>
              <Flex alignItems="center">
                <Flex.Item display="flex" marginRight={2}>
                  <TokenIconPair tokenPair={mocks.tokenPair} />
                </Flex.Item>
                <Flex.Item>
                  <Typography.Title level={4}>
                    {mocks.tokenPair.tokenA} / {mocks.tokenPair.tokenB}
                  </Typography.Title>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Button size="large" type="text" icon={<SettingOutlined />} />
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Typography.Title level={5}>Amount</Typography.Title>
          <Box contrast>hello</Box>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Typography.Title level={5}>Pooled Assets</Typography.Title>
          <Box contrast>hello</Box>
        </Flex.Item>
        <Flex.Item marginBottom={4}>
          <Typography.Title level={5}>Earned Fees</Typography.Title>
          <Box contrast>hello</Box>
        </Flex.Item>
        <Flex.Item>
          <Button type="primary" block>
            Remove
          </Button>
        </Flex.Item>
      </Flex>
    </FormPageWrapper>
  );
};

export { Remove };
