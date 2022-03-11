import './Input.less';

import { Input as BaseInput, InputProps as BaseInputProps } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

export type InputProps = BaseInputProps & {
  state?: 'warning' | 'error';
  align?: 'left' | 'right' | 'center';
  isActive?: boolean;
};

interface Extension {
  TextArea: typeof BaseInput.TextArea;
  Password: typeof BaseInput.Password;
}

const _Input: FC<InputProps> & Extension = ({
  state,
  isActive,
  className,
  align,
  ...rest
}) =>
  (
    <BaseInput
      {...rest}
      className={cn(className, {
        'ant-input-state--warning': state === 'warning',
        'ant-input-state--error': state === 'error',
        'ant-input-state--active': isActive,
        'ant-input-align--right': align === 'right',
        'ant-input-align--left': align === 'left',
        'ant-input-align--center': align === 'center',
      })}
    />
  ) as any;
_Input.TextArea = BaseInput.TextArea;
_Input.Password = BaseInput.Password;

export const Input = _Input;
