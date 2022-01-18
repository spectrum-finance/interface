import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Typography } from '../../../../ergodex-cdk';

interface LockedPositionItemProps {
  isActive: boolean;
  x?: Currency;
  y?: Currency;
  lp?: Currency;
  pool?: AmmPool;
  onClick?: () => void;
}

export const LockedPositionItem: FC<LockedPositionItemProps> = (
  { onClick, isActive, x, y, lp, pool } = { isActive: false },
) => {
  return (
    <ListItemWrapper onClick={onClick} isActive={isActive}>
      <Flex>
        <Flex.Item style={{ width: '30%' }} marginRight={2}>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Box padding={0.5}>
                <TokenIcon name={'ERG'} />
              </Box>
            </Flex.Item>
            <Flex.Item>
              <Box>
                <Flex justify="space-between">
                  <TokenIcon name={'ERG'} />
                  <Typography.Title level={5}>
                    213,332.230009340
                  </Typography.Title>
                </Flex>
              </Box>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'hello'} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'hello'} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'hello'} />
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>TVL</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'hello'} />
          </Flex>
        </Flex.Item>
      </Flex>
    </ListItemWrapper>
  );
};
