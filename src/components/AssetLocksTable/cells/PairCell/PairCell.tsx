import React, { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { AssetLock } from '../../../../common/models/AssetLock';
import { Currency } from '../../../../common/models/Currency';
import { AssetTitle } from '../../../AssetTitle/AssetTitle';

export interface AssetBoxProps {
  readonly currency: Currency;
  readonly className?: string;
}

const _AssetBox: FC<AssetBoxProps> = ({ currency, className }) => (
  <Box padding={[0.5, 2]} transparent className={className} borderRadius="l">
    <Flex align="center">
      <AssetTitle size="small" asset={currency.asset} />
      <Flex.Item marginLeft={1} flex={1} display="flex" justify="flex-end">
        <Typography.Body align="right">{currency.toString()}</Typography.Body>
      </Flex.Item>
    </Flex>
  </Box>
);

const AssetBox = styled(_AssetBox)`
  border-color: var(--spectrum-table-border-color);
`;

export interface PairCellProps {
  readonly lock: AssetLock;
}

export const PairCell: FC<PairCellProps> = ({ lock }) => (
  <Flex col width={200}>
    <Flex.Item marginBottom={1}>
      <AssetBox currency={lock.x} />
    </Flex.Item>
    <AssetBox currency={lock.y} />
  </Flex>
);
