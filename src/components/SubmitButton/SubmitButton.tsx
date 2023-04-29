import './SubmitButton.less';

import { Button, ButtonProps } from '@ergolabs/ui-kit';
import * as React from 'react';

const SubmitButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button className="ergodex-submit-button" type="primary" block {...rest}>
      {children}
    </Button>
  );
};

export { SubmitButton };
