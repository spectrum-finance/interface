import './AmountInput.scss';

import {
  AmountInput as BaseAmountInput,
  AmountInputProps,
} from '@alfalab/core-components-amount-input';
import cn from 'classnames';
import React from 'react';

const AmountInput: React.FC<AmountInputProps> = (props) => {
  const updatedProps = {
    block: true,
    bold: false,
    ...props,
    className: cn('core-amount-input__field', props.fieldClassName),
  };
  return (
    <div className="core-amount-input">
      <BaseAmountInput {...updatedProps} />
    </div>
  );
};
export { AmountInput };
