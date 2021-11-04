import React from 'react';

import { Button, QuestionCircleOutlined, Tooltip } from '../../ergodex-cdk';

interface InfoTooltipProps {
  content: React.ReactNode | React.ReactNode[] | string;
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

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, placement }) => {
  return (
    <Tooltip placement={placement ?? 'right'} title={content}>
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
