import './Alert.less';

import { Alert, AlertProps } from 'antd';
import React from 'react';

export interface CustomAlertProps extends AlertProps {
  noBorder?: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = (props) => {
  return (
    <Alert
      {...props}
      className={props.noBorder ? 'alert-not-border' : ''}
    ></Alert>
  );
};
