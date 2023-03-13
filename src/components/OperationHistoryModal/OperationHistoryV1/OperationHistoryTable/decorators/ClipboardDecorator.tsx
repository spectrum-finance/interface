import { message } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC, ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Operation } from '../../../../../common/models/Operation';

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
    onCopy={() => message.success(t`Transaction ID successfully copied`)}
  >
    {children}
  </CopyToClipboard>
);
