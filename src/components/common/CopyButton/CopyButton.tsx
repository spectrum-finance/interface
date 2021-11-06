import './CopyButton.less';

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIcon } from '../../../assets/icons/icon-copy.svg';
import { Button, message, Tooltip } from '../../../ergodex-cdk';

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  return (
    <CopyToClipboard text={text} onCopy={() => message.success('Copied!')}>
      <Tooltip title="Copy">
        <Button className="copy-button" type="text">
          <CopyIcon />
        </Button>
      </Tooltip>
    </CopyToClipboard>
  );
};

export { CopyButton };
