import styles from './AutoInputContainer.module.scss';

import React from 'react';

// eslint-disable-next-line react/display-name
export const AutoInputContainer = React.memo(
  (props: React.PropsWithChildren<unknown>) => {
    const { children } = props;
    return <div className={styles.autoInput}>{children}</div>;
  },
);
