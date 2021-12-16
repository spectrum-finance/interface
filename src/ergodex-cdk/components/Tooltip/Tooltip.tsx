import './Tooltip.less';

import { Tooltip as BaseTooltip, TooltipProps as BaseTooltipProps } from 'antd';
import React from 'react';
import { FC } from 'react';

//@ts-ignore
export type TooltipProps = {
  width?: number;
} & BaseTooltipProps;

export const Tooltip: FC<TooltipProps> = ({ width, title, ...rest }) => {
  return <BaseTooltip {...rest} title={<div style={{ width }}>{title}</div>} />;
};
