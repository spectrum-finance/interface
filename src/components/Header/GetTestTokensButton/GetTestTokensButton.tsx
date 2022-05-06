import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Button, DollarOutlined, Modal } from '../../../ergodex-cdk';
import { FaucetModal } from '../../FaucetModal/FaucetModal';

export interface GetTestTokensButtonProps {
  readonly className?: string;
}

export const _GetTestTokensButton: FC<GetTestTokensButtonProps> = ({
  className,
}) => {
  const openFaucetModal = () =>
    Modal.open(({ close }) => <FaucetModal close={close} />);

  return (
    <Button
      size="large"
      type="primary"
      className={className}
      onClick={openFaucetModal}
      icon={<DollarOutlined style={{ marginRight: 4 }} />}
    >
      <Trans>Get test tokens</Trans>
    </Button>
  );
};

export const GetTestTokensButton = styled(_GetTestTokensButton)`
  height: 40px;
`;
