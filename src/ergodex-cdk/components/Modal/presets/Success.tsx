import { CheckCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';

export interface SuccessProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Success: FC<SuccessProps> = ({ content }) => (
  <>
    <Row justify="center" bottomGutter={6}>
      <CheckCircleOutlined
        style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
      />
    </Row>
    {content}
  </>
);
