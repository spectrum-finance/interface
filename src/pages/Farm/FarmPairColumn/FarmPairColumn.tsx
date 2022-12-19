import {
  Button,
  ExclamationCircleFilled,
  Flex,
  Tag,
  Tooltip,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { useObservable } from '../../../common/hooks/useObservable';
import { LmPool } from '../../../common/models/LmPool';
import { AssetPairTitle } from '../../../components/AssetPairTitle/AssetPairTitle';
import { InfoTooltip } from '../../../components/InfoTooltip/InfoTooltip';
import { networkContext$ } from '../../../gateway/api/networkContext';
import { FarmState } from '../types/FarmState';

export interface PairColumnProps {
  readonly lmPool: LmPool;
  readonly direction?: 'col' | 'row';
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

const getTag = (status: FarmState) => {
  if (status === FarmState.Scheduled) {
    return (
      <Tag color="orange">
        <Trans>Scheduled</Trans>
      </Tag>
    );
  }

  if (status === FarmState.Finished) {
    return (
      <Tag color="magenta">
        <Trans>Finished</Trans>
      </Tag>
    );
  }

  if (status === FarmState.Live) {
    return (
      <Tag color="green">
        <Trans>Live</Trans>
      </Tag>
    );
  }
};

export const FarmPairColumn: FC<PairColumnProps> = ({
  lmPool,
  direction = 'row',
  align = 'center',
}) => {
  return (
    <Flex align="center">
      {lmPool.balanceLq.isPositive() && lmPool.balanceVlq.isPositive() ? (
        <Flex.Item marginRight={2}>
          <Tooltip
            placement="top"
            title={
              <div>
                <Trans>
                  It seems like you stake only some of your LP tokens...
                  <br /> Stake all of them to gain more rewards!
                </Trans>
              </div>
            }
            width={200}
          >
            <Button
              type="ghost"
              icon={<ExclamationCircleFilled style={{ color: '#D89614' }} />}
              size="small"
              style={{
                border: 0,
                background: 0,
                width: 16,
              }}
            />
          </Tooltip>
        </Flex.Item>
      ) : null}

      <Flex.Item>
        <AssetPairTitle
          assetX={lmPool.ammPool.x.asset}
          assetY={lmPool.ammPool.y.asset}
          direction={direction}
          align={align}
        />
      </Flex.Item>
      <Flex.Item marginLeft={2} marginRight={2}>
        {getTag(lmPool.currentStatus)}
      </Flex.Item>
    </Flex>
  );
};
