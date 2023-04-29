import {
  Button,
  ExclamationCircleFilled,
  Flex,
  Tag,
  Tooltip,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, MouseEvent } from 'react';
import { first } from 'rxjs';
import styled from 'styled-components';

import { Farm, FarmStatus } from '../../../../../common/models/Farm';
import { AssetPairTitle } from '../../../../../components/AssetPairTitle/AssetPairTitle';
import { lmDeposit } from '../../../../../gateway/api/operations/lmDeposit';
import { createFarmOperationModal } from '../../../FarmOperationModal/FarmOperationModal';

export interface PairColumnProps {
  readonly farm: Farm;
  readonly align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
}

const TestTag = styled(Tag)`
  border-color: var(--spectrum-primary-color);
  background-color: var(--spectrum-icon-second-tone-color);
  color: var(--spectrum-primary-color);
`;

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

  const stake = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    lmDeposit(farm, createFarmOperationModal(farm, 'stake'))
      .pipe(first())
      .subscribe();
  };

  return (
    <Flex align="center">
      {farm.isTest && (
        <Flex.Item marginRight={2}>
          <TestTag>
            <Trans>Test</Trans>
          </TestTag>
        </Flex.Item>
      )}
      {farm.yourStakeLq.isPositive() &&
      farm.availableToStakeLq.isPositive() &&
      farm.status === FarmStatus.Live ? (
        <Flex.Item marginRight={2}>
          <Tooltip
            placement="top"
            title={
              <Flex col align="flex-start">
                <Flex.Item marginBottom={1}>
                  <Trans>
                    It seems like you are currently only staking part of your LP
                    tokens
                  </Trans>
                  <br />
                  <Trans>Stake all of them to gain more rewards!</Trans>
                </Flex.Item>
                <Button
                  onClick={stake}
                  type="link"
                  size="small"
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <Trans>Stake now</Trans>
                </Button>
              </Flex>
            }
            width={250}
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
