import React, { ReactElement } from 'react';
import styled from 'styled-components';

import { Button } from '../../../../ergodex-cdk';

interface TongueArrowButtonProps {
  icon: ReactElement;
}
const TongueButton = styled(Button)`
  border-width: 0 !important;
  // prettier-ignore
  clip-path: path('M8 0H20V33C16.6302 26.8731 12.322 25.2509 7.99529 24.9134C3.59039 24.5697 0 21.4183 0 17V8C0 3.58172 3.58172 0 8 0Z');
  height: 33px !important;
  width: 20px !important;
  border-radius: 0 !important;
  background-color: var(--ergo-tongue-bg-color) !important;
  color: var(--ergo-tongue-icon-color) !important;
`;

export const TongueArrowButton: React.FC<TongueArrowButtonProps> = ({
  icon,
}) => {
  const iconWithStyles = React.cloneElement(icon, {
    size: 12,
    style: { fontSize: '12px', top: '-4px', position: 'relative' },
  });
  return (
    <TongueButton
      icon={iconWithStyles}
      className="ergodex-tongue-arrow-btn"
      size="large"
      shape="default"
    />
  );
};
