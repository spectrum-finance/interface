import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import { Currency } from '../../../../common/models/Currency';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Tag, Typography } from '../../../../ergodex-cdk';

interface LockedPositionItemProps {
  isActive: boolean;
  x?: Currency;
  y?: Currency;
  lp?: Currency;
  pool?: AmmPool;
  onClick?: () => void;
  status?: string;
}

export const LockedPositionItem: FC<LockedPositionItemProps> = (
  { status, onClick, isActive, x, y, lp, pool } = { isActive: false },
) => {
  return (
    <ListItemWrapper onClick={onClick} isActive={isActive}>
      <Flex>
        <Flex.Item style={{ width: '230px' }} marginRight={4}>
          <Flex col justify="space-between">
            <Flex.Item marginBottom={1}>
              <Box padding={[0.5, 1]}>
                <Flex justify="space-between">
                  <Flex.Item marginRight={1}>
                    <Flex>
                      <Flex.Item marginRight={1}>
                        <TokenIcon name={'ERG'} />
                      </Flex.Item>
                      <Typography.Title level={5}>ERG</Typography.Title>
                    </Flex>
                  </Flex.Item>
                  <Typography.Title level={5}>
                    213,332.230009340
                  </Typography.Title>
                </Flex>
              </Box>
            </Flex.Item>
            <Flex.Item>
              <Box padding={[0.5, 1]}>
                <Flex justify="space-between">
                  <Flex.Item marginRight={1}>
                    <Flex>
                      <Flex.Item marginRight={1}>
                        <TokenIcon name={'ERG'} />
                      </Flex.Item>
                      <Typography.Title level={5}>ERG</Typography.Title>
                    </Flex>
                  </Flex.Item>
                  <Typography.Title level={5}>
                    213,332.230009340
                  </Typography.Title>
                </Flex>
              </Box>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '45px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Share</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'99%'} />
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '183px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Unlock Date</Typography.Footnote>
            </Flex.Item>
            <DataTag content={`31 September 2022`} />
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '75px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Unlock Block</Typography.Footnote>
            </Flex.Item>
            <DataTag content={'1,667,285'} />
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '135px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Status</Typography.Footnote>
            </Flex.Item>
            <Tag
              color={status === 'Locked' ? 'warning' : 'success'}
              style={{ display: 'block', marginBottom: '2px' }}
            >
              {status}
            </Tag>
          </Flex>
        </Flex.Item>
      </Flex>
    </ListItemWrapper>
  );
};
