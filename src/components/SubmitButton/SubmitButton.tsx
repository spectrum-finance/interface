import './SubmitButton.less';

import React from 'react';

import { Button, ButtonProps } from '../../ergodex-cdk';

const SubmitButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button className="ergodex-submit-button" type="primary" block {...rest}>
      {children}
    </Button>
  );
};

export { SubmitButton };
