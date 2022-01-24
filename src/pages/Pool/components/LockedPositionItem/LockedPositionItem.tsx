import { blocksToMillis } from '@ergolabs/ergo-dex-sdk/build/main/utils/blocks';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { AmmPool } from '../../../../common/models/AmmPool';
import {
  AssetLock,
  AssetLockStatus,
} from '../../../../common/models/AssetLock';
import { Currency } from '../../../../common/models/Currency';
import { DataTag } from '../../../../components/common/DataTag/DataTag';
import { ListItemWrapper } from '../../../../components/ListItemWrapper/ListItemWrapper';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Box, Flex, Tag, Typography } from '../../../../ergodex-cdk';
import { formatToInt } from '../../../../services/number';

interface LockedPositionItemProps {
  assetLock: AssetLock;
  pool: AmmPool;
  isActive: boolean;
  onClick?: () => void;
}

export const LockedPositionItem: FC<LockedPositionItemProps> = ({
  pool,
  assetLock,
  onClick,
  isActive,
}) => {
  const [xAssetAmount, yAssetAmount] = [assetLock.x, assetLock.y];

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
                        <TokenIcon name={pool?.x.asset.name} />
                      </Flex.Item>
                      <Typography.Title level={5}>
                        {pool?.x.asset.name}
                      </Typography.Title>
                    </Flex>
                  </Flex.Item>
                  <Typography.Title level={5}>
                    {xAssetAmount.toString({ suffix: false })}
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
                        <TokenIcon name={pool?.y.asset.name} />
                      </Flex.Item>
                      <Typography.Title level={5}>
                        {pool?.y.asset.name}
                      </Typography.Title>
                    </Flex>
                  </Flex.Item>
                  <Typography.Title level={5}>
                    {yAssetAmount.toString({ suffix: false })}
                  </Typography.Title>
                </Flex>
              </Box>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        {/*<Flex.Item style={{ width: '45px' }} marginRight={4}>*/}
        {/*  <Flex col justify="space-between" stretch>*/}
        {/*    <Flex.Item marginBottom={1}>*/}
        {/*      <Typography.Footnote>Share</Typography.Footnote>*/}
        {/*    </Flex.Item>*/}
        {/*    <DataTag content={'99%'} />*/}
        {/*  </Flex>*/}
        {/*</Flex.Item>*/}
        <Flex.Item style={{ width: '183px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Unlock Date</Typography.Footnote>
            </Flex.Item>
            <DataTag
              content={assetLock.unlockDate.toLocaleString(DateTime.DATE_FULL)}
            />
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '75px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Unlock Block</Typography.Footnote>
            </Flex.Item>
            <DataTag content={formatToInt(assetLock.deadline)} />
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ width: '135px' }} marginRight={4}>
          <Flex col justify="space-between" stretch>
            <Flex.Item marginBottom={1}>
              <Typography.Footnote>Status</Typography.Footnote>
            </Flex.Item>
            <Tag
              color={
                assetLock.status === AssetLockStatus.LOCKED
                  ? 'warning'
                  : 'success'
              }
              style={{ display: 'block', marginBottom: '2px' }}
            >
              {assetLock.status === 0 ? 'Locked' : 'Withdrawable'}
            </Tag>
          </Flex>
        </Flex.Item>
      </Flex>
    </ListItemWrapper>
  );
};
