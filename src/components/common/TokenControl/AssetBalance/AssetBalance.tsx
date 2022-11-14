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
  <div>
    <Typography.Body secondary>{t`Balance: `} </Typography.Body>
    <Typography.Body onClick={onClick} className={className}>
      {balance.toString()}
    </Typography.Body>
  </div>
);

export const AssetBalance = styled(_AssetBalance)`
  margin-left: var(--spectrum-base-gutter);
  ${(props) =>
    props.onClick &&
    css`
      color: var(--spectrum-primary-color) !important;
      cursor: pointer;
    `}
`;
