import { Button, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { CSSProperties, FC } from 'react';
import styled from 'styled-components';

import { FaucetModal } from '../../../../FaucetModal/FaucetModal';

export interface GetTestTokensButtonProps {
  readonly className?: string;
  readonly style?: CSSProperties;
}

export const _GetTestTokensButton: FC<GetTestTokensButtonProps> = ({
  className,
  style,
}) => {
  const openFaucetModal = () => Modal.open(() => <FaucetModal />);

  return (
    <Button
      size="large"
      type="primary"
      className={className}
      onClick={openFaucetModal}
      style={style}
    >
      <Trans>Get tADA</Trans>
    </Button>
  );
};

export const GetTestTokensButton = styled(_GetTestTokensButton)`
  height: 40px;
`;
