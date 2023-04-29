import {
  Animation,
  Button,
  Flex,
  Loading3QuartersOutlined,
  message,
  Space,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import styled from 'styled-components';

import { ProtocolDisclaimerAlert } from '../../../../../components/common/ConnectWalletButton/ChooseWalletModal/ProtocolDisclaimerAlert/ProtocolDisclaimerAlert';
import {
  createErgoPayDeepLink,
  createSelectAddressesRequestLink,
} from '../common/ergopayLinks';

type Props = {
  handleClick: () => void;
  loadingRequestId: boolean;
  requestId?: string;
};

const FullWidthButton = styled(Button)`
  width: 100%;
`;

const LargeLink = styled(Typography.Link)`
  font-size: 16px !important;
`;

export const ErgoPayTabPaneContentDesktop: FC<Props> = ({
  handleClick,
  loadingRequestId,
  requestId,
}) => {
  if (!requestId) {
    return null;
  }

  return (
    <Animation.Expand expanded={!!requestId}>
      <Flex col justify="center">
        <Flex.Item marginBottom={4} marginTop={4}>
          <ProtocolDisclaimerAlert />
        </Flex.Item>
        <Space size={40} direction="vertical">
          <Flex.Item col display="flex" justify="center" marginTop={12}>
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
          <Flex col>
            <Flex.Item marginBottom={2} alignSelf="center">
              <Typography.Title level={4}>
                <Trans>Scan QR code</Trans>
              </Typography.Title>
            </Flex.Item>
            <Flex.Item marginBottom={4} alignSelf="center">
              <div style={{ background: 'white', padding: '8px' }}>
                {requestId && (
                  <QRCode
                    size={170}
                    value={createErgoPayDeepLink(
                      createSelectAddressesRequestLink(requestId),
                    )}
                  />
                )}
              </div>
            </Flex.Item>
            <Flex.Item alignSelf="center" marginBottom={4}>
              <LargeLink
                href="https://ergoplatform.org/en/get-erg/#Wallets"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Find an ErgoPay compatible wallet</Trans>
              </LargeLink>
            </Flex.Item>
            <Flex.Item display="flex" align="center" width="100%">
              <Flex.Item marginRight={2} flex={1}>
                <CopyToClipboard
                  text={createErgoPayDeepLink(
                    createSelectAddressesRequestLink(requestId),
                  )}
                  onCopy={() => message.success(t`Copied to clipboard!`)}
                >
                  <FullWidthButton
                    type="default"
                    size="large"
                    disabled={loadingRequestId}
                  >
                    <Trans>Copy request</Trans>
                  </FullWidthButton>
                </CopyToClipboard>
              </Flex.Item>
              <Flex.Item flex={1}>
                <FullWidthButton
                  type="primary"
                  size="large"
                  onClick={handleClick}
                >
                  <Trans>Open external wallet</Trans>
                </FullWidthButton>
              </Flex.Item>
            </Flex.Item>
          </Flex>
        </Space>
      </Flex>
    </Animation.Expand>
  );
};
