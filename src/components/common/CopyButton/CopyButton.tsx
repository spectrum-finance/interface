import './CopyButton.less';

import { t } from '@lingui/macro';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIcon } from '../../../assets/icons/icon-copy.svg';
import { Button, message, Tooltip } from '../../../ergodex-cdk';

interface CopyButtonProps {
  text: string;
  children?: ReactNode | string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, children }) => {
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success(t`Copied to clipboard!`)}
    >
      <Tooltip
        title={t`Copy to clipboard.`}
        trigger={children ? 'none' : 'hover'}
      >
        <Button
          className={cn(
            'copy-button',
            children ? 'copy-button--with-children' : '',
          )}
          type="text"
          icon={<CopyIcon />}
        >
          {children}
        </Button>
      </Tooltip>
    </CopyToClipboard>
  );
};

export { CopyButton };
