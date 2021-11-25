import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Flex } from '../../Flex/Flex';
import { Row } from '../../Row/Row';
import { ModalContent } from '../ModalContent/ModalContent';
import { ModalTitle } from '../ModalTitle/ModalTitle';
import { INFO_DIALOG_WIDTH } from './core';

export interface WarningProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Warning: FC<WarningProps> = ({ content }) => (
  <>
    <ModalTitle />
    <ModalContent width={INFO_DIALOG_WIDTH}>
      <Flex justify="center" direction="row">
        <Flex.Item marginBottom={6}>
          <ExclamationCircleOutlined
            style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
          />
        </Flex.Item>
      </Flex>
      {content}
    </ModalContent>
  </>
);
