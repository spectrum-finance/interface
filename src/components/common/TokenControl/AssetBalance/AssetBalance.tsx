import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as WalletIcon } from '../../../../assets/icons/wallet-icon.svg';
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
}) => {
  const { moreThan } = useDevice();
  return (
    <Flex align="center" gap={1}>
      <Typography.Body secondary size="small">
        {moreThan('m') ? (
          t`Balance:`
        ) : (
          <WalletIcon style={{ fontSize: '12px', display: 'flex' }} />
        )}
      </Typography.Body>
      <Typography.Body size="small" onClick={onClick} className={className}>
        {balance.toString()}
      </Typography.Body>
    </Flex>
  );
};

export const AssetBalance = styled(_AssetBalance)`
  margin-left: var(--spectrum-base-gutter);
  ${(props) =>
    props.onClick &&
    css`
      color: var(--spectrum-primary-color) !important;
      cursor: pointer;
    `}
`;
