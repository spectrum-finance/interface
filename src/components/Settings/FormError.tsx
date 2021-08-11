import React from 'react';
import { Text } from '@geist-ui/react';

export const FormError = (
  props: React.PropsWithChildren<unknown> & {
    type: 'error' | 'warning' | undefined;
  },
): JSX.Element => {
  const { children, type } = props;
  return type ? (
    <Text p small type={type}>
      {children}
    </Text>
  ) : (
    <></>
  );
};
