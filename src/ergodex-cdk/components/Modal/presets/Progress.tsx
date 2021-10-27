import { LoadingOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';
import { Spin } from '../../Spin/Spin';

export interface ProgressProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Progress: FC<ProgressProps> = ({ content }) => (
  <>
    <Row justify="center" bottomGutter={6}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} />} />
    </Row>
    {content}
  </>
);
