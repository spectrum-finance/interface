import {
  Button,
  Flex,
  Loading3QuartersOutlined,
  Space,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { isIOS } from 'react-device-detect';

import { ProtocolDisclaimerAlert } from '../../../../../components/common/ConnectWalletButton/ChooseWalletModal/ProtocolDisclaimerAlert/ProtocolDisclaimerAlert';

type Props = {
  handleClick: () => void;
  loadingRequestId: boolean;
};

export const ErgoPayTabPaneContentMobile: FC<Props> = ({
  handleClick,
  loadingRequestId,
}) => {
  return (
    <Flex col justify="center">
      <Flex.Item marginBottom={4} marginTop={4}>
        <ProtocolDisclaimerAlert />
      </Flex.Item>
      <Space size={40} direction="vertical">
        <Flex.Item col display="flex" justify="center" marginTop={10}>
          <Flex.Item marginBottom={2} display="flex" justify="center">
            <Loading3QuartersOutlined
              style={{
                color: 'var(--spectrum-primary-text)',
                fontSize: '16px',
              }}
              spin={true}
            />
          </Flex.Item>
          <Typography.Body size="large" align="center">
            <Trans>Waiting for connection with ErgoPay</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex direction="col" gap={2}>
          <Button
            href={
              isIOS
                ? 'https://apps.apple.com/app/terminus-wallet-ergo/id1643137927'
                : 'https://play.google.com/store/apps/details?id=org.ergoplatform.android'
            }
            target="_blank"
            size="large"
            type="default"
          >
            Install external wallet app
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleClick}
            disabled={loadingRequestId}
          >
            Open external wallet
          </Button>
        </Flex>
      </Space>
    </Flex>
  );
};
