import { t, Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

import {
  Button,
  DollarOutlined,
  Flex,
  MessageOutlined,
  Modal,
  Tooltip,
} from '../../ergodex-cdk';
import { FaucetModal } from '../FaucetModal/FaucetModal';

interface UserButtonsProps {
  className?: string;
}

const FEEDBACK_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfTh-mvSY5xAEjvRXml0F0ZK8yHk9ZAQlEhpHNtTomybHIFNw/viewform?usp=sf_link';

export const UserButtons: React.FC<UserButtonsProps> = ({ className }) => {
  const openFaucetModal = () => {
    Modal.open(({ close }) => <FaucetModal close={close} />);
  };

  return (
    <Flex className={className}>
      <Flex.Item marginRight={2}>
        <Button
          block
          type="primary"
          style={{ height: 40 }}
          onClick={openFaucetModal}
          icon={<DollarOutlined style={{ marginRight: 4 }} />}
        >
          <Trans>Get test tokens</Trans>
        </Button>
      </Flex.Item>
      <Button
        block
        type="primary"
        style={{ height: 40, lineHeight: '40px' }}
        href={FEEDBACK_URL}
        target="_blank"
        icon={<MessageOutlined style={{ marginRight: 4 }} />}
      >
        <Trans>Leave feedback</Trans>
      </Button>
    </Flex>
  );
};
