import React, {
  CSSProperties,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Flex, LeftOutlined } from 'src/ergodex-cdk';
import styled from 'styled-components';

import { TongueArrowButton } from './TongueArrowButton/TongueArrowButton';

interface TongueProps {
  style?: CSSProperties;
  onClick?: MouseEventHandler;
  icon?: ReactNode;
  arrow?: ReactElement;
  iconDisabled?: boolean;
}

export const TongueIconContainer = styled.div<{ disabled: boolean }>`
  background-color: var(--ergo-tongue-bg-color);
  padding: 16px;
  border-bottom-left-radius: 16px;
  cursor: pointer;
  color: var(--ergo-tongue-icon-color);
  visibility: ${({ disabled }) => (disabled ? 'hidden' : 'visible')};
`;

export const Tongue: React.FC<TongueProps> = ({
  style,
  onClick,
  iconDisabled = false,
  icon,
  arrow = <LeftOutlined />,
}) => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (iconDisabled) {
      setShowIcon(false);
    }
  }, [iconDisabled]);

  return (
    <Flex
      style={{
        transform: `translateX(${showIcon ? 0 : 46}px)`,
        transition: 'transform .4s',
        ...style,
      }}
      onMouseEnter={() => !iconDisabled && setShowIcon(true)}
      onMouseLeave={() => !iconDisabled && setShowIcon(false)}
      onClick={onClick}
    >
      <TongueArrowButton icon={arrow} />
      <TongueIconContainer disabled={iconDisabled}>{icon}</TongueIconContainer>
    </Flex>
  );
};
