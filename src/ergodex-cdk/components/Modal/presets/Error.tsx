import { CloseCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Flex } from '../../Flex/Flex';
import { ModalContent } from '../ModalContent/ModalContent';
import { ModalTitle } from '../ModalTitle/ModalTitle';
import { INFO_DIALOG_WIDTH } from './core';

export interface ErrorProps {
  readonly content:
    | ReactNode
    | ReactNode[]
    | string
    | ((result: any) => ReactNode | ReactNode[] | string);
  readonly result?: any;
}

export const Error: FC<ErrorProps> = ({ content, result }) => (
  <>
    <ModalTitle />
    <ModalContent width={INFO_DIALOG_WIDTH}>
      <Flex justify="center" direction="row">
        <Flex.Item marginBottom={6}>
          <CloseCircleOutlined
            style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
          />
        </Flex.Item>
      </Flex>
      {content instanceof Function ? content(result) : content}
    </ModalContent>
  </>
);
