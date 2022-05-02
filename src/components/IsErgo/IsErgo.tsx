import React, { FC, ReactNode } from 'react';

import { useSelectedNetwork } from '../../gateway/common/network';

export interface IsErgoProps {
  readonly children: ReactNode | ReactNode[] | string;
}

export const IsErgo: FC<IsErgoProps> = ({ children }) => {
  const [selectedNetwork] = useSelectedNetwork();

  return <>{selectedNetwork.name === 'ergo' && children}</>;
};
