import { FC, ReactNode } from 'react';

import { useApplicationSettings } from '../../context';

interface SensitiveContent {
  children: ReactNode | string;
}
export const SensitiveContent: FC<SensitiveContent> = ({ children }) => {
  const [{ isSensitiveHidden }] = useApplicationSettings();
  return (
    <span style={{ filter: isSensitiveHidden ? 'blur(5px)' : 'none' }}>
      {children}
    </span>
  );
};
