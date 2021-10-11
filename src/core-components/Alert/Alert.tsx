import './Alert.less';

import { Alert as AntdAlert, AlertProps as AntdAlertProps } from 'antd';
import React from 'react';

export interface AlertProps extends AntdAlertProps {
  noBorder?: boolean;
}

export const Alert: React.FC<AlertProps> = (props) => {
  return (
    <AntdAlert
      {...props}
      className={props.noBorder ? 'alert-not-border' : ''}
    ></AntdAlert>
  );
};
