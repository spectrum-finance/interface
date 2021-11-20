import { LoadingOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';
import { Spin } from '../../Spin/Spin';
import { ModalTitle } from '../ModalTitle';
import { INFO_DIALOG_WIDTH } from './core';

export interface ProgressProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Progress: FC<ProgressProps> = ({ content }) => (
  <div style={{ width: INFO_DIALOG_WIDTH }}>
    <ModalTitle />
    <Row justify="center" bottomGutter={6}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} />} />
    </Row>
    {content}
  </div>
);
