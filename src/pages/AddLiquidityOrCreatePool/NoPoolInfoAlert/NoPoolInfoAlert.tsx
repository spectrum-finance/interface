import { Alert } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

interface NoPoolInfoAlertProps {
  readonly className?: string;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const NoPoolInfoAlert: FC<NoPoolInfoAlertProps> = ({ children }) => (
  <Alert
    description={children}
    type="info"
    style={{
      padding:
        'calc(2 * var(--ergo-base-gutter)) calc(4 * var(--ergo-base-gutter))',
      width: '100%',
    }}
  />
);
