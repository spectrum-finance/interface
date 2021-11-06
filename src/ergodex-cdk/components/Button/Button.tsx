import './Button.less';

import { Button as BaseButton, ButtonProps as BaseButtonProps } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

// @ts-ignore
export interface ButtonProps extends BaseButtonProps {
  size?: 'small' | 'middle' | 'large' | 'extra-large';
}

export const Button: FC<ButtonProps> = ({
  size,
  className,
  children,
  disabled,
  loading,
  ...other
}) => (
  <BaseButton
    {...other}
    size={size === 'extra-large' ? 'large' : size}
    loading={loading}
    disabled={disabled}
    className={cn(className, { 'ant-btn-extra-lg': size === 'extra-large' })}
  >
    {children}
  </BaseButton>
);
