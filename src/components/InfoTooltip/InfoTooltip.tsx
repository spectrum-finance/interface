import React, { ReactNode } from 'react';

import { Button, QuestionCircleOutlined, Tooltip } from '../../ergodex-cdk';

interface InfoTooltipProps {
  content: ReactNode | ReactNode[] | string;
  children?: ReactNode | ReactNode[] | string;
  className?: string;
  width?: number;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  className,
  content,
  placement,
  width,
}) => {
  return (
    <Tooltip
      placement={placement ?? 'right'}
      title={content}
      className={className}
      width={width}
    >
      <Button
        type="ghost"
        icon={<QuestionCircleOutlined />}
        size="small"
        style={{ border: 0, background: 0 }}
      />
    </Tooltip>
  );
};

export { InfoTooltip };
