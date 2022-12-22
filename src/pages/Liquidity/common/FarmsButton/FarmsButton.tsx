import { Button } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { AmmPool } from '../../../../common/models/AmmPool';

export interface FarmsButtonProps {
  readonly className?: string;
  readonly ammPool: AmmPool;
}

const _FarmsButton: FC<FarmsButtonProps> = ({ className, ammPool }) => {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`../../farm?searchString=${ammPool.id}`);
  };

  return (
    <Button
      onClick={handleClick}
      size="small"
      type="primary"
      htmlType="button"
      className={className}
    >
      <Trans>Farms</Trans>
    </Button>
  );
};

export const FarmsButton = styled(_FarmsButton)`
  border-color: transparent;
  background: var(--spectrum-connect-wallet-btn-bg) !important;
  color: var(--spectrum-connect-wallet-btn-color) !important;

  &:hover {
    border-color: var(--spectrum-connect-wallet-btn-border);
  }
`;
