import React from 'react';
import { Text } from '@geist-ui/react';

export const FormError = (
  props: React.PropsWithChildren<unknown>,
): JSX.Element => {
  const { children } = props;
  return children ? (
    <Text p small type="error">
      {children}
    </Text>
  ) : (
    <></>
  );
};
