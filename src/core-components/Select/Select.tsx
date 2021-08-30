import React from 'react';
import cn from 'classnames';
import {
  Select as BaseSelect,
  SelectProps,
  OptionShape,
} from '@alfalab/core-components-select';
import './Select.scss';

export type SelectOptionShape = OptionShape;

const Select: React.FC<SelectProps> = (props) => {
  const updatedProps = {
    closeOnSelect: true,
    ...props,
    className: cn('core-select', props.className),
    fieldClassName: cn('core-select__field', props.fieldClassName),
  };
  return <BaseSelect {...updatedProps} />;
};
export { Select };
