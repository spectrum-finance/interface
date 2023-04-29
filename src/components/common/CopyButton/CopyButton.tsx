import { Button, ButtonProps, Icon, message, Tooltip } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { ReactNode } from 'react';
import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ReactComponent as CopyIcon } from '../../../assets/icons/icon-copy.svg';

interface CopyButtonProps {
  text: string;
  children?: ReactNode | string;
  size?: ButtonProps['size'];
  messageContent?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  size = 'small',
  messageContent,
}) => {
  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        message.success(messageContent || t`Address successfully copied`);
      }}
    >
      <Tooltip title={t`Copy Address to clipboard.`} trigger="hover">
        <Button
          size={size}
          onClick={(e) => e.stopPropagation()}
          icon={<Icon component={CopyIcon} />}
          style={{ lineHeight: '24px' }}
        />
      </Tooltip>
    </CopyToClipboard>
  );
};

export { CopyButton };
