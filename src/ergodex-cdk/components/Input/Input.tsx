import './Input.less';

import { Input as BaseInput, InputProps as BaseInputProps } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FC } from 'react';

export type InputProps = BaseInputProps & {
  state?: 'warning' | 'error';
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
  ...rest
}) =>
  (
    <BaseInput
      {...rest}
      className={cn(className, {
        'ant-input-state--warning': state === 'warning',
        'ant-input-state--error': state === 'error',
        'ant-input-state--active': isActive,
      })}
    />
  ) as any;
_Input.TextArea = BaseInput.TextArea;
_Input.Password = BaseInput.Password;

export const Input = _Input;
