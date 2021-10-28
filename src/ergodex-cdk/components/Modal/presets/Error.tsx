import { CloseCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';

export interface ErrorProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Error: FC<ErrorProps> = ({ content }) => (
  <>
    <Row justify="center" bottomGutter={6}>
      <CloseCircleOutlined
        style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
      />
    </Row>
    {content}
  </>
);
