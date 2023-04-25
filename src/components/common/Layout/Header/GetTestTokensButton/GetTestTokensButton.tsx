import { Button, DollarOutlined, Modal } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { CSSProperties, FC } from 'react';
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
  const openFaucetModal = () =>
    Modal.open(({ close }) => <FaucetModal close={close} />);

  return (
    <Button
      size="large"
      type="primary"
      className={className}
      onClick={openFaucetModal}
      icon={<DollarOutlined style={{ marginRight: 4 }} />}
      style={style}
    >
      <Trans>Get test tokens</Trans>
    </Button>
  );
};

export const GetTestTokensButton = styled(_GetTestTokensButton)`
  height: 40px;
`;
