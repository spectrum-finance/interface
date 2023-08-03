import { Button, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as AdaHandleIcon } from '../ada-handle-icon.svg';
import { openAdaHandleModal } from '../AdaHandleModal/AdaHandleModal.tsx';

interface AdaHandleChangeButtonProps {
  className?: string;
}
const _AdaHandleChangeButton: FC<AdaHandleChangeButtonProps> = ({
  className,
}) => {
  return (
    <Button
      className={className}
      type="text"
      size="small"
      onClick={() => openAdaHandleModal()}
    >
      <Flex align="center">
        <AdaHandleIcon />
        <Flex.Item marginLeft={1}>
          <Trans>Change</Trans>
        </Flex.Item>
      </Flex>
    </Button>
  );
};

export const AdaHandleChangeButton = styled(_AdaHandleChangeButton)`
  .ergo-flex {
    .ergo-flex {
      font-weight: 700;
      color: #0cd15b !important;
    }
  }
`;
