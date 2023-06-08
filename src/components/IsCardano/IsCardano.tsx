import { FC, ReactNode } from 'react';

import { useSelectedNetwork } from '../../gateway/common/network';

export interface IsCardanoProps {
  readonly children: ReactNode | ReactNode[] | string;
}

export const IsCardano: FC<IsCardanoProps> = ({ children }) => {
  const [selectedNetwork] = useSelectedNetwork();

  return <>{selectedNetwork.name !== 'ergo' && children}</>;
};
