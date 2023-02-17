import {
  Button,
  ExclamationCircleFilled,
  Flex,
  Tag,
  Tooltip,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { AssetPairTitle } from '../../../../../components/AssetPairTitle/AssetPairTitle';

export interface PairColumnProps {
  readonly farm: Farm;
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

const getTag = (status: FarmStatus) => {
  if (status === FarmStatus.Scheduled) {
    return (
      <Tag color="orange">
        <Trans>Scheduled</Trans>
      </Tag>
    );
  }

  if (status === FarmStatus.Finished) {
    return (
      <Tag color="magenta">
        <Trans>Finished</Trans>
      </Tag>
    );
  }

  if (status === FarmStatus.Live) {
    return (
      <Tag color="green">
        <Trans>Live</Trans>
      </Tag>
    );
  }
};

export const FarmPairColumn: FC<PairColumnProps> = ({ farm }) => {
  const { valBySize } = useDevice();

  return (
    <Flex align="center">
      {farm.yourStakeLq.isPositive() &&
      farm.availableToStakeLq.isPositive() &&
      farm.status === FarmStatus.Live ? (
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
          assetX={farm.ammPool.x.asset}
          assetY={farm.ammPool.y.asset}
          direction={valBySize('col', 'row')}
          align={valBySize('flex-start', 'center')}
        />
      </Flex.Item>
      <Flex.Item marginLeft={2} marginRight={2}>
        {getTag(farm.status)}
      </Flex.Item>
    </Flex>
  );
};
