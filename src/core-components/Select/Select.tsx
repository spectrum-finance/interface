import './Select.scss';

import {
  OptionShape,
  Select as BaseSelect,
  SelectProps,
} from '@alfalab/core-components-select';
import cn from 'classnames';
import React from 'react';

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
