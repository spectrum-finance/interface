import { Box, Divider, DownOutlined, Flex } from '@ergolabs/ui-kit';
import { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';

interface CollapseProps {
  title: ReactNode | string;
  children: ReactNode;
  initialExpanded?: boolean;
  contentHeight: number;
}

const CollapseContent = styled.div<{ expanded: boolean; height: number }>`
  height: ${({ height, expanded }) => (expanded ? `${height}px` : '0')};
  overflow: hidden;
  transition: all 0.3s;
`;

export const SimpleCollapse: FC<CollapseProps> = ({
  initialExpanded = false,
  title,
  children,
  contentHeight,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleCollapse = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      secondary
      padding={[2, 3]}
      borderRadius="l"
      glass
      style={{ cursor: 'pointer' }}
    >
      <Flex
        className="spectrum-simple-collapse--main"
        align="center"
        onClick={toggleCollapse}
      >
        <Flex.Item flex={1}>{title}</Flex.Item>
        <Flex.Item marginLeft={2}>
          <DownOutlined
            style={{
              color: 'var(--spectrum-secondary-text)',
              transition: 'all 0.3s ease',
              transform: expanded ? 'rotateZ(-180deg)' : 'none',
            }}
          />
        </Flex.Item>
      </Flex>
      <CollapseContent expanded={expanded} height={contentHeight}>
        <Flex>
          <Flex.Item width="100%" marginTop={2} marginBottom={2}>
            <Divider
              style={{ backgroundColor: 'var(--spectrum-box-border-color)' }}
            />
          </Flex.Item>
        </Flex>
        {children}
      </CollapseContent>
    </Box>
  );
};
