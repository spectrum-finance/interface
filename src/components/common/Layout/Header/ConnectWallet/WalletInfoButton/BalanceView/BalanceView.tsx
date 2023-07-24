import { Typography } from '@ergolabs/ui-kit';
import { FC } from 'react';
import styled from 'styled-components';

import { Currency } from '../../../../../../../common/models/Currency';
import { SensitiveContent } from '../../../../../../SensitiveContent/SensitiveContent.tsx';

export interface BalanceViewProps {
  readonly balance: Currency;
  readonly className?: string;
}

const _BalanceView: FC<BalanceViewProps> = ({ className, balance }) => (
  <SensitiveContent>
    <Typography.Body className={className}>
      {balance.toCurrencyString()}
    </Typography.Body>
  </SensitiveContent>
);

export const BalanceView = styled(_BalanceView)`
  font-size: 1rem !important;
  white-space: nowrap !important;
`;
