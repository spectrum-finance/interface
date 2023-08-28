import {
  ArrowLeftOutlined,
  Button,
  Flex,
  Input,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC, useState } from 'react';

import { SPECTRUM_DISCORD_LINK } from '../../common/constants/url.ts';
import { useObservable } from '../../common/hooks/useObservable.ts';
import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton.tsx';
import { Page } from '../../components/Page/Page.tsx';
import { selectedWallet$ } from '../../gateway/api/wallets.ts';
import { RewardsDashboard } from './RewardsDashboard/RewardsDashboard.tsx';

const ConnectWalletCheckForm = ({ onClick }) => {
  return (
    <Flex col align="center">
      <Flex.Item width="100%">
        <ConnectWalletButton
          width="100%"
          size="extra-large"
          trace={{
            element_location: 'rewards-page',
            element_name: 'connect-wallet-button',
          }}
        />
      </Flex.Item>
      <Flex.Item>
        <Typography.Body secondary>Or check</Typography.Body>{' '}
        <Button type="link" style={{ padding: 0 }} onClick={onClick}>
          manually
        </Button>
      </Flex.Item>
    </Flex>
  );
};

const ManualCheckForm = ({ onClick }) => {
  return (
    <Flex col align="center">
      <Flex.Item width="100%" marginBottom={2}>
        <Flex>
          <Flex.Item marginRight={2} width="100%">
            <Input
              placeholder={t`Paste your Cardano address...`}
              size="large"
            />
          </Flex.Item>
          <Button type="primary" size="large">
            <Trans>Check rewards</Trans>
          </Button>
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={onClick}>
          <Trans>Back</Trans>
        </Button>
      </Flex.Item>
    </Flex>
  );
};

interface CheckFormProps {
  readonly isConnectWalletForm: boolean;
  readonly onClick: () => void;
}

const CheckForm: FC<CheckFormProps> = ({ isConnectWalletForm, onClick }) => {
  if (isConnectWalletForm) {
    return <ConnectWalletCheckForm onClick={onClick} />;
  }
  return <ManualCheckForm onClick={onClick} />;
};

export const Rewards = () => {
  const [isConnectWalletForm, setIsConnectWalletForm] = useState(true);
  const [selectedWallet] = useObservable(selectedWallet$);

  const onFormViewChange = () => {
    setIsConnectWalletForm((prev) => !prev);
  };
  return (
    <Page width={500}>
      <Flex col>
        <Flex.Item marginBottom={4} display="flex" justify="space-between">
          <Typography.Title level={4}>Rewards</Typography.Title>
          <Button href={SPECTRUM_DISCORD_LINK} target="_blank">
            Support
          </Button>
        </Flex.Item>
        <Flex.Item>
          {selectedWallet ? (
            <RewardsDashboard />
          ) : (
            <CheckForm
              onClick={onFormViewChange}
              isConnectWalletForm={isConnectWalletForm}
            />
          )}
        </Flex.Item>
      </Flex>
    </Page>
  );
};
