import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalRef,
  Tabs,
  Tag,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { ReactNode, useState } from 'react';
import { noop } from 'rxjs';
import styled from 'styled-components';

import { panalytics } from '../../../../common/analytics';
import { useObservable } from '../../../../common/hooks/useObservable';
import {
  connectWallet,
  selectedWallet$,
  wallets$,
} from '../../../../gateway/api/wallets';
import { useSelectedNetwork } from '../../../../gateway/common/network';
import { Wallet } from '../../../../network/common/Wallet';
import { ErgoPayTabPaneContent } from '../../../../network/ergo/widgets/ErgoPayModal/ErgoPayTabPaneContent/ErgoPayTabPaneContent';

const { Body } = Typography;

interface WalletItemProps {
  wallet: Wallet;
  close: (result?: boolean) => void;
  isChangeWallet?: boolean;
}

const WalletButton = styled(Button)`
  align-items: center;
  display: flex;
  height: 4rem;
  width: 100%;

  &:disabled,
  &:disabled:hover {
    border-color: var(--spectrum-default-border-color) !important;
    filter: grayscale(1);

    span {
      color: var(--spectrum-default-border-color) !important;
    }
  }
`;

const ExperimentalWalletBox = styled(Box)`
  background: var(--spectrum-box-bg-tag);
  border: 1px solid var(--spectrum-default-border-color);

  .dark & {
    background: var(--spectrum-box-bg-contrast);
  }
`;

const ChooseWalletTabs = styled(Tabs)`
  .ant-tabs-ink-bar {
    border-radius: 12px !important;
  }

  .ant-tabs-tab,
  .ant-tabs-nav-list {
    flex-grow: 1;
    width: 100%;
    border-radius: 12px !important;
  }

  .ant-tabs-tab {
    justify-content: center;
    height: 24px;
    border-radius: 12px !important;
  }
`;

const WalletView: React.FC<WalletItemProps> = ({
  wallet,
  close,
  isChangeWallet,
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<ReactNode | undefined>(undefined);
  const [selectedWallet] = useObservable(selectedWallet$);

  const handleClick = () => {
    setLoading(true);
    connectWallet(wallet).subscribe(
      (isConnected) => {
        setLoading(false);
        if (typeof isConnected === 'boolean' && isConnected) {
          selectedWallet?.name === wallet.name
            ? noop()
            : !isChangeWallet
            ? panalytics.connectWallet(wallet.name)
            : panalytics.changeWallet(wallet.name);

          close(true);
        } else if (isConnected) {
          selectedWallet?.name === wallet.name
            ? noop()
            : !isChangeWallet
            ? panalytics.connectWalletError(wallet.name)
            : panalytics.changeWalletError(wallet.name);
          setWarning(isConnected);
        }
      },
      () => {
        setLoading(false);
        selectedWallet?.name === wallet.name
          ? noop()
          : !isChangeWallet
          ? panalytics.connectWalletInstallExtension(wallet.name)
          : panalytics.changeWalletInstallExtension(wallet.name);
        window.open(wallet.extensionLink);
      },
    );
  };

  const handleCheck = () => setChecked((prev) => !prev);

  switch (wallet.definition) {
    case 'experimental':
      return (
        <ExperimentalWalletBox padding={2}>
          <Flex col>
            <Flex.Item marginBottom={2} alignSelf="flex-end">
              <Tag color="gold">
                <Trans>Experimental</Trans>
              </Tag>
            </Flex.Item>
            <Flex.Item marginBottom={2}>
              <Checkbox checked={checked} onChange={handleCheck}>
                <Trans>
                  This wallet may not always work as expected. I understand what
                  I do and will use it at my own risk.
                </Trans>
              </Checkbox>
            </Flex.Item>
            {warning && (
              <Flex.Item marginBottom={2}>
                <Alert
                  type="warning"
                  description={warning}
                  style={{ width: '100%' }}
                />
              </Flex.Item>
            )}
            <WalletButton
              size="large"
              disabled={!checked}
              onClick={handleClick}
              loading={loading}
            >
              <Flex.Item flex={1} display="flex" align="center">
                <Body>{wallet.name}</Body>
              </Flex.Item>
              {wallet.icon}
            </WalletButton>
          </Flex>
        </ExperimentalWalletBox>
      );
    case 'recommended':
      return (
        <Flex col>
          <Flex.Item marginBottom={2} alignSelf="flex-end">
            <Tag color="success">
              <Trans>Recommended</Trans>
            </Tag>
          </Flex.Item>
          {warning && (
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                description={warning}
                style={{ width: '100%' }}
              />
            </Flex.Item>
          )}
          <WalletButton size="large" onClick={handleClick} loading={loading}>
            <Flex.Item flex={1} display="flex" align="center">
              <Body>{wallet.name}</Body>
            </Flex.Item>
            {wallet.icon}
          </WalletButton>
        </Flex>
      );
    default:
      return (
        <>
          <WalletButton size="large" onClick={handleClick} loading={loading}>
            <Flex.Item flex={1} display="flex" align="center">
              {wallet.name}
            </Flex.Item>
            {wallet.icon}
          </WalletButton>
          {warning && (
            <Flex.Item marginBottom={2}>
              <Alert
                type="warning"
                description={warning}
                style={{ width: '100%' }}
              />
            </Flex.Item>
          )}
        </>
      );
  }
};

type ChooseWalletModalProps = ModalRef<boolean> & { isChangeWallet?: boolean };

const ChooseWalletModal: React.FC<ChooseWalletModalProps> = ({
  close,
  isChangeWallet,
}): JSX.Element => {
  const [wallets] = useObservable(wallets$, [], []);

  const [selectedWallet] = useObservable(selectedWallet$);
  const [selectedNetwork] = useSelectedNetwork();

  const { s } = useDevice();
  return (
    <>
      <Modal.Title>
        <Trans>Select a wallet</Trans>
      </Modal.Title>
      <Modal.Content width={480}>
        <ChooseWalletTabs size="middle">
          {selectedNetwork.name === 'ergo' && s ? (
            <Tabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayMobile">
              <ErgoPayTabPaneContent close={close} />
            </Tabs.TabPane>
          ) : null}
          <Tabs.TabPane
            tab={<Trans>Browser wallet</Trans>}
            key="browse_wallets"
          >
            <Flex.Item marginTop={5} display="block">
              {wallets
                .filter((w) => !w.hidden)
                .map((wallet, index) => (
                  <Flex.Item
                    marginBottom={
                      index === wallets.length - 1 && !selectedWallet ? 0 : 4
                    }
                    key={index}
                  >
                    <WalletView
                      close={close}
                      wallet={wallet}
                      isChangeWallet={isChangeWallet}
                    />
                  </Flex.Item>
                ))}
            </Flex.Item>
          </Tabs.TabPane>
          {selectedNetwork.name === 'ergo' && !s ? (
            <Tabs.TabPane tab={<Trans>ErgoPay</Trans>} key="ergopayDesktop">
              <ErgoPayTabPaneContent close={close} />
            </Tabs.TabPane>
          ) : null}
        </ChooseWalletTabs>
      </Modal.Content>
    </>
  );
};

export { ChooseWalletModal };
