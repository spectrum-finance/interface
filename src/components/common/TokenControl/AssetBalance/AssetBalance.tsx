import { Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { Currency } from '../../../../common/models/Currency';

export interface AssetBalanceProps {
  readonly balance: Currency;
  readonly onClick?: () => void;
  readonly className?: string;
}

const _AssetBalance: FC<AssetBalanceProps> = ({
  balance,
  onClick,
  className,
}) => (
  <Typography.Body secondary>
    {t`Balance:`}{' '}
    <span onClick={onClick} className={className}>
      {balance.toString()}
    </span>
  </Typography.Body>
);

export const AssetBalance = styled(_AssetBalance)`
  ${(props) =>
    props.onClick &&
    css`
      color: var(--spectrum-primary-color);
      cursor: pointer;
    `}
`;
