import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { ReactComponent as CheckedIcon } from '../../../../assets/icons/checked-icon.svg';

interface FeeBoxProps {
  readonly className?: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
  readonly description?: ReactNode | ReactNode[] | string;
  readonly content?: ReactNode | ReactNode[] | string;
}

const _ActiveIcon: FC<{ className?: string }> = ({ className }) => (
  <CheckedIcon className={className} />
);

const ActiveIcon = styled(_ActiveIcon)`
  position: absolute;
  top: 0;
  right: 0;
  color: var(--spectrum-primary-color);
  transform: translate(50%, -50%);
`;

const _FeeBox: FC<FeeBoxProps> = ({
  className,
  content,
  description,
  active,
  onClick,
}) => (
  <Box
    className={className}
    padding={[0, 3]}
    onClick={onClick}
    borderRadius="l"
    glass
    secondary
  >
    {active && <ActiveIcon />}
    <Flex col justify="center" stretch>
      <Flex.Item marginBottom={1}>
        <Typography.Title level={4}>{content}</Typography.Title>
      </Flex.Item>
      <Typography.Body size="small" secondary>
        {description}
      </Typography.Body>
    </Flex>
  </Box>
);

export const FeeBox = styled(_FeeBox)`
  background: var(--spectrum-pool-position-bg);
  cursor: pointer;
  height: 90px;
  position: relative;
  border-color: ${(props) =>
    props.active ? 'var(--spectrum-primary-color)' : ''} !important;

  &:hover {
    border-color: var(--spectrum-primary-color);
  }
`;
