import { Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as WalletIcon } from '../../../../assets/icons/wallet-icon.svg';
import { Currency } from '../../../../common/models/Currency';
import { SensitiveContent } from '../../../SensitiveContent/SensitiveContent.tsx';

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
  const { moreThan, valBySize } = useDevice();
  return (
    <Flex align="center" gap={1}>
      <Typography.Body secondary size={valBySize('small', 'base')}>
        {moreThan('m') ? (
          t`Balance:`
        ) : (
          <WalletIcon style={{ fontSize: '12px', display: 'flex' }} />
        )}
      </Typography.Body>
      <SensitiveContent>
        <Typography.Body
          size={valBySize('small', 'base')}
          onClick={onClick}
          className={className}
          secondary={balance.toString() === '0'}
        >
          {balance.toString()}
        </Typography.Body>
      </SensitiveContent>
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
