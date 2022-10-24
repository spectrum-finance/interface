import { DownOutlined, Flex, Typography, UpOutlined } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

export interface MoreInfoButton {
  readonly onClick?: () => void;
  readonly className?: string;
  readonly opened?: boolean;
}

const _MoreInfoButton: FC<MoreInfoButton> = ({
  onClick,
  opened,
  className,
}) => (
  <Flex
    justify="center"
    align="center"
    width="100%"
    className={className}
    onClick={onClick}
  >
    <Flex.Item marginRight={1}>
      <Typography.Body size="small" secondary hint>
        {opened ? t`Less` : t`More`}
      </Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body size="small" secondary hint>
        {opened ? <UpOutlined width={10} /> : <DownOutlined width={10} />}
      </Typography.Body>
    </Flex.Item>
  </Flex>
);

export const MoreInfoButton = styled(_MoreInfoButton)`
  cursor: pointer;
  user-select: none;
`;
