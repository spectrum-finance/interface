import { Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import { Flex, Typography } from '../../../../ergodex-cdk';
import { formatToPercent } from '../../../../services/number';
import {
  AmmPoolConfidenceAnalytic,
  LocksGroup,
} from '../../AmmPoolConfidenceAnalytic';

export interface AnalyticOverviewProps {
  data: LocksGroup | AmmPoolConfidenceAnalytic;
}

const AmountOverview: FC<{ currency: Currency }> = ({ currency }) => (
  <Flex align="center">
    <Flex.Item marginRight={1}>
      <AssetIcon asset={currency.asset} />
    </Flex.Item>
    <Flex.Item marginRight={1}>
      <Typography.Body>{currency.asset.name}</Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body>{currency.toString()}</Typography.Body>
    </Flex.Item>
  </Flex>
);

const isLocksGroup = (
  data: LocksGroup | AmmPoolConfidenceAnalytic,
): data is LocksGroup => data instanceof LocksGroup;

export const AnalyticOverview: FC<AnalyticOverviewProps> = ({ data }) => {
  return (
    <Flex>
      <Flex.Item marginRight={6}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <AmountOverview currency={data.lockedX} />
          </Flex.Item>
          <Flex.Item>
            <AmountOverview currency={data.lockedY} />
          </Flex.Item>
        </Flex>
      </Flex.Item>
      <Flex.Item marginRight={6}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            <Typography.Body secondary>
              <Trans>Share</Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>
              {formatToPercent(data.lockedPercent)}
            </Typography.Body>
          </Flex.Item>
        </Flex>
      </Flex.Item>
      {isLocksGroup(data) && (
        <>
          <Flex.Item marginRight={6}>
            <Flex col>
              <Flex.Item marginBottom={2}>
                <Typography.Body secondary>
                  <Trans>Unlock date</Trans>
                </Typography.Body>
              </Flex.Item>
              <Flex.Item>
                <Typography.Body>
                  {data.unlockDate.toLocaleString(DateTime.DATE_FULL)}
                </Typography.Body>
              </Flex.Item>
            </Flex>
          </Flex.Item>
          <Flex.Item>
            <Flex col>
              <Flex.Item marginBottom={2}>
                <Typography.Body secondary>
                  <Trans>Unlock block</Trans>
                </Typography.Body>
              </Flex.Item>
              <Flex.Item>
                <Typography.Body>{data.deadline}</Typography.Body>
              </Flex.Item>
            </Flex>
          </Flex.Item>
        </>
      )}
    </Flex>
  );
};
