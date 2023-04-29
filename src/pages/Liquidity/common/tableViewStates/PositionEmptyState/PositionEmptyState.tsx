import {
  Button,
  EmptyDataState,
  Flex,
  PlusOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { ElementLocation, ElementName } from '@spectrumlabs/analytics';
import { FC } from 'react';
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
        <ConnectWalletButton
          trace={{
            element_name: ElementName.connectWalletButton,
            element_location: ElementLocation.yourPositionsList,
          }}
        >
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
