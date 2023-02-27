import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { Currency } from '../../../../common/models/Currency';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import {
  AmmPoolConfidenceAnalytic,
  LocksGroup,
} from '../../AmmPoolConfidenceAnalytic';

export interface AnalyticOverviewProps {
  data: LocksGroup | AmmPoolConfidenceAnalytic;
}

const AmountOverview: FC<{ currency: Currency }> = ({ currency }) => (
  <Flex align="center" gap={1}>
    <AssetIcon size="tiny" asset={currency.asset} />
    <Typography.Body size="extra-small">
      {currency.asset.ticker}
    </Typography.Body>
    <Typography.Body size="extra-small">{currency.toString()}</Typography.Body>
  </Flex>
);

export const AnalyticOverview: FC<AnalyticOverviewProps> = ({ data }) => {
  return (
    <Box padding={0.5} bordered={false} borderRadius="s">
      <Flex col>
        <AmountOverview currency={data.lockedX} />
        <AmountOverview currency={data.lockedY} />
      </Flex>
    </Box>
  );
};
