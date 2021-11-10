import React from 'react';

import {
  Box,
  Button,
  CheckCircleOutlined,
  CloseCircleOutlined,
  Flex,
  LinkOutlined,
  Tag,
  Typography,
} from '../../ergodex-cdk';

const YOROI_NIGHTLY_URL =
  'https://chrome.google.com/webstore/detail/yoroi-nightly/poonlenmfdfbjfeeballhiibknlknepo';
const YOROI_DAPP_CONNECTOR_URL =
  'https://chrome.google.com/webstore/detail/yoroi-ergo-dapp-connector/chifollcalpmjdiokipacefnpmbgjnle';
const YOROI_URL =
  'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb';

interface HowToUseModalProps {
  onClose: () => void;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({
  onClose,
}): JSX.Element => {
  return (
    <Flex flexDirection="col">
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          The following guide explains how to use ErgoDEX with Yoroi Nightly
          wallet. We are currently working with Emurgo on an updated version of
          Yoroi.
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Use Google Chrome, Brave or Sidekick browser to interact with ErgoDEX
        </Tag>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Tag color="error" icon={<CloseCircleOutlined />}>
          Do not use Safari or Mozilla Firefox, because there are no wallet
          extensions
        </Tag>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          1. In order to start using ErgoDEX you need to install the following
          two Google Chrome extensions:
        </Typography.Body>
        <Box transparent>
          <Button
            href={YOROI_NIGHTLY_URL}
            target="_blank"
            type="link"
            icon={<LinkOutlined />}
          >
            Yoroi Nightly
          </Button>
        </Box>
        <Box transparent>
          <Button
            href={YOROI_DAPP_CONNECTOR_URL}
            target="_blank"
            type="link"
            icon={<LinkOutlined />}
          >
            Yoroi dApp Connector Nightly
          </Button>
        </Box>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          2. Create new ERG wallet using Yoroi Nightly;
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          3. Send a small amount of ERGs (1-2 ERGs) to your Yoroi Nightly wallet
          address. For this step use{' '}
          <Button
            href={YOROI_URL}
            target="_blank"
            type="link"
            style={{ padding: 0, lineHeight: '14px', height: 'px14px' }}
          >
            Yoroi Wallet
          </Button>{' '}
          or withdraw ERGs from your exchange account;
        </Typography.Body>
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Body>
          4. Congratulations! You are now ready to use ErgoDEX!
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <Button type="primary" block size="large" onClick={onClose}>
          Get started!
        </Button>
      </Flex.Item>
    </Flex>
  );
};

export { HowToUseModal };
