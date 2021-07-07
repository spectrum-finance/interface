import React from 'react';

import styles from './OverflowAddress.module.scss';

type OverflowAddressProps = {
  address: string;
};

// eslint-disable-next-line react/display-name
export const OverflowAddress = React.memo((props: OverflowAddressProps) => {
  const { address } = props;

  return (
    <span className={styles.root}>
      <span className={styles.clipped}>
        {address.substr(0, address.length / 2)}
      </span>
      <span>{address.substr(address.length / 2)}</span>
    </span>
  );
});
