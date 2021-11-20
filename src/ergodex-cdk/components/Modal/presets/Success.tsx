import { CheckCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';
import { ModalTitle } from '../ModalTitle';
import { INFO_DIALOG_WIDTH } from './core';

export interface SuccessProps {
  readonly content:
    | ReactNode
    | ReactNode[]
    | string
    | ((result: any) => ReactNode | ReactNode[] | string);
  readonly result?: any;
}

export const Success: FC<SuccessProps> = ({ content, result }) => (
  <div style={{ width: INFO_DIALOG_WIDTH }}>
    <ModalTitle />
    <Row justify="center" bottomGutter={6}>
      <CheckCircleOutlined
        style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
      />
    </Row>
    {content instanceof Function ? content(result) : content}
  </div>
);
