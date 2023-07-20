import {
  Flex,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  Tooltip,
  Typography,
} from '@ergolabs/ui-kit';
import { ReactNode } from 'react';
import * as React from 'react';

interface InfoTooltipProps {
  content: ReactNode | ReactNode[] | string;
  children?: ReactNode | ReactNode[] | string;
  color?: 'secondary' | 'warning' | 'danger';
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
  size?: 'large' | 'base' | 'small' | 'extra-small' | 'footnote';
  defaultVisible?: boolean;
  isQuestionIcon?: boolean;
}

const getColor = (color: InfoTooltipProps['color']) => {
  switch (color) {
    case 'secondary':
      return 'var(--spectrum-disabled-text-contrast)';
    case 'warning':
      return 'var(--spectrum-warning-color)';
    case 'danger':
      return 'var(--spectrum-error-color)';
    default:
      return '';
  }
};

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  className,
  content,
  placement,
  width,
  color,
  children,
  size,
  defaultVisible = false,
  isQuestionIcon,
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
        defaultVisible={defaultVisible}
      >
        <Typography.Body
          size={size}
          style={{
            color: getColor(color),
            marginLeft: children ? '4px' : '0px',
            cursor: 'pointer',
          }}
        >
          {isQuestionIcon ? <QuestionCircleOutlined /> : <InfoCircleOutlined />}
        </Typography.Body>
      </Tooltip>
    </Flex>
  );
};
