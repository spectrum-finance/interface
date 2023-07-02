import { FC, ReactNode } from 'react';

import { useApplicationSettings } from '../../context';

interface SensitiveContent {
  children: ReactNode | string;
}
export const SensitiveContent: FC<SensitiveContent> = ({ children }) => {
  const [{ isSensitiveHidden }] = useApplicationSettings();
  return (
    <span
      style={{
        filter: isSensitiveHidden ? 'blur(7px)' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </span>
  );
};
