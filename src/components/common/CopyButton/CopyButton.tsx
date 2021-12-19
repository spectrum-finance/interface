import './CopyButton.less';

import cn from 'classnames';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIcon } from '../../../assets/icons/icon-copy.svg';
import { Button, message, Tooltip } from '../../../ergodex-cdk';

interface CopyButtonProps {
  text: string;
  children?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, children }) => {
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success('Copied to clipboard!')}
    >
      <Tooltip title="Copy to clipboard." trigger={children ? 'none' : 'hover'}>
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
