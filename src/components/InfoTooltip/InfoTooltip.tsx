import {
  Button,
  Flex,
  QuestionCircleOutlined,
  Tooltip,
} from '@ergolabs/ui-kit';
import React, { ReactNode } from 'react';

interface InfoTooltipProps {
  content: ReactNode | ReactNode[] | string;
  children?: ReactNode | ReactNode[] | string;
  secondary?: boolean;
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
  size?: 'default' | 'small';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  className,
  content,
  placement,
  width,
  size,
  secondary,
  children,
}) => {
  return (
    <Flex align="center" inline>
      {children}
      <Tooltip
        placement={placement ?? 'right'}
        title={content}
        className={className}
        width="100%"
        maxWidth={width}
      >
        <Button
          type="ghost"
          icon={<QuestionCircleOutlined />}
          size="small"
          style={{
            border: 0,
            background: 0,
            width: size === 'small' ? '12px' : '',
            color:
              size === 'small' || secondary
                ? 'var(--spectrum-disabled-text-contrast)'
                : '',
          }}
        />
      </Tooltip>
    </Flex>
  );
};
