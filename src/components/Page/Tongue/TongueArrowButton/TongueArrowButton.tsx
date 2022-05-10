import './TongueArrowButton.less';

import React, { ReactElement } from 'react';
import { Button } from 'src/ergodex-cdk';

interface TongueArrowButtonProps {
  icon: ReactElement;
}

export const TongueArrowButton: React.FC<TongueArrowButtonProps> = ({
  icon,
}) => {
  const iconWithStyles = React.cloneElement(icon, {
    size: 12,
    style: { fontSize: '12px', top: '-4px', position: 'relative' },
  });
  return (
    <Button
      icon={iconWithStyles}
      className="ergodex-tongue-arrow-btn"
      size="large"
      shape="default"
    />
  );
};
