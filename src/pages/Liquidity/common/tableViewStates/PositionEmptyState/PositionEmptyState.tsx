import {
  Button,
  EmptyDataState,
  Flex,
  PlusOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConnectWalletButton } from '../../../../../components/common/ConnectWalletButton/ConnectWalletButton';

export const PositionEmptyState: FC = () => {
  const navigate = useNavigate();

  const handleNewPositionClick = () => navigate('add');

  return (
    <EmptyDataState height={160}>
      <Flex col align="center">
        <Flex.Item marginBottom={2}>
          <Typography.Body align="center">
            <Trans>Your liquidity positions will appear here.</Trans>
          </Typography.Body>
        </Flex.Item>
        <ConnectWalletButton>
          <Button
            icon={<PlusOutlined />}
            onClick={handleNewPositionClick}
            type="primary"
          >
            <Trans>New position</Trans>
          </Button>
        </ConnectWalletButton>
      </Flex>
    </EmptyDataState>
  );
};
