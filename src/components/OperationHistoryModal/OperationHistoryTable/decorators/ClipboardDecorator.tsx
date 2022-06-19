import { t } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Operation } from '../../../../common/models/Operation';
import { message } from '../../../../ergodex-cdk';

export interface ClipboardDecoratorProps {
  readonly item: Operation;
  readonly children: ReactNode | ReactNode[] | string;
}

export const ClipboardDecorator: FC<ClipboardDecoratorProps> = ({
  children,
  item,
}) => (
  <CopyToClipboard
    text={item.txId}
    onCopy={() => message.success(t`Copied to clipboard!`)}
  >
    {children}
  </CopyToClipboard>
);
