import { LoadingOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Flex } from '../../Flex/Flex';
import { Row } from '../../Row/Row';
import { Spin } from '../../Spin/Spin';
import { ModalContent } from '../ModalContent/ModalContent';
import { ModalTitle } from '../ModalTitle/ModalTitle';
import { INFO_DIALOG_WIDTH } from './core';

export interface ProgressProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Progress: FC<ProgressProps> = ({ content }) => (
  <>
    <ModalTitle />
    <ModalContent width={INFO_DIALOG_WIDTH}>
      <Flex justify="center" direction="row">
        <Flex.Item marginBottom={6}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} />} />
        </Flex.Item>
      </Flex>
      {content}
    </ModalContent>
  </>
);
