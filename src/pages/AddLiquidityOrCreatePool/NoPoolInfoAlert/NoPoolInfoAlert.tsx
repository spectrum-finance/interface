import { Alert } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

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
        'calc(2 * var(--spectrum-base-gutter)) calc(4 * var(--spectrum-base-gutter))',
      width: '100%',
    }}
  />
);
