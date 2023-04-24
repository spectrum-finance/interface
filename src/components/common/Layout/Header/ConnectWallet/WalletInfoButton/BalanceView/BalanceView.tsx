import { Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../../../../common/models/Currency';

export interface BalanceViewProps {
  readonly balance: Currency;
  readonly className?: string;
}

const _BalanceView: FC<BalanceViewProps> = ({ className, balance }) => (
  <Typography.Body className={className}>
    {balance.toCurrencyString()}
  </Typography.Body>
);

export const BalanceView = styled(_BalanceView)`
  font-size: 1rem !important;
  white-space: nowrap !important;
`;
