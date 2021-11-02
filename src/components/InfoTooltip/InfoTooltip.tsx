import React from 'react';

import { Button, QuestionCircleOutlined, Tooltip } from '../../ergodex-cdk';

interface InfoTooltipProps {
  text: string;
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

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, placement }) => {
  return (
    <Tooltip placement={placement ?? 'right'} title={text}>
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
