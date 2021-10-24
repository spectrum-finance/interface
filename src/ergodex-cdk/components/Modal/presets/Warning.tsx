import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { FC, ReactNode } from 'react';

import { Row } from '../../Row/Row';

export interface WarningProps {
  readonly content: ReactNode | ReactNode[] | string;
}

export const Warning: FC<WarningProps> = ({ content }) => (
  <>
    <Row justify="center" bottomGutter={3}>
      <ExclamationCircleOutlined
        style={{ fontSize: 80, color: 'var(--ergo-primary-color)' }}
      />
    </Row>
    {content}
  </>
);
