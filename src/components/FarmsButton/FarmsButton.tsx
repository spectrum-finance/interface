import { Button } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, MouseEvent } from 'react';
import styled from 'styled-components';

export interface FarmsButtonProps {
  readonly className?: string;
  readonly onClick?: (e: MouseEvent) => void;
}

const _FarmsButton: FC<FarmsButtonProps> = ({ className, onClick }) => {
  return (
    <Button
      onClick={onClick}
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
