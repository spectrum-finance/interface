import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { TokenIcon } from '../../../../components/TokenIcon/TokenIcon';
import { Flex, Typography } from '../../../../ergodex-cdk';
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
      <TokenIcon asset={currency.asset} />
    </Flex.Item>
    <Flex.Item marginRight={1}>
      <Typography.Body>{currency.asset.name}</Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body>{currency.toAmount()}</Typography.Body>
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
            <Typography.Body secondary>Share</Typography.Body>
          </Flex.Item>
          <Flex.Item>
            <Typography.Body>{data.lockedPercent.toFixed(2)}%</Typography.Body>
          </Flex.Item>
        </Flex>
      </Flex.Item>
      {isLocksGroup(data) && (
        <>
          <Flex.Item marginRight={6}>
            <Flex col>
              <Flex.Item marginBottom={2}>
                <Typography.Body secondary>Unlock date</Typography.Body>
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
                <Typography.Body secondary>Unlock block</Typography.Body>
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
