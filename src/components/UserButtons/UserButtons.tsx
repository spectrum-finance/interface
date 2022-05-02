import { t } from '@lingui/macro';
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

const _UserButtons: React.FC<UserButtonsProps> = ({ className }) => {
  const openFaucetModal = () => {
    Modal.open(({ close }) => <FaucetModal close={close} />);
  };

  return (
    <Flex col className={className}>
      <Flex.Item marginBottom={2}>
        <Tooltip title={t`Get testnet tokens`} placement="left">
          <Button
            block
            type="primary"
            size="large"
            onClick={openFaucetModal}
            icon={<DollarOutlined />}
          />
        </Tooltip>
      </Flex.Item>
      <Flex.Item>
        <Tooltip title={t`Leave feedback`} placement="left">
          <Button
            block
            type="primary"
            size="large"
            href={FEEDBACK_URL}
            target="_blank"
            icon={<MessageOutlined />}
          />
        </Tooltip>
      </Flex.Item>
    </Flex>
  );
};

const UserButtons = styled(_UserButtons)`
  position: fixed;
  right: 16px;
  top: 300px;
  transform: translate(0, -50%);
`;

export { UserButtons };
