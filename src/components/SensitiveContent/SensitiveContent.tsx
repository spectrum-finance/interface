import { FC, ReactNode } from 'react';

import { useApplicationSettings } from '../../context';

interface SensitiveContent {
  children: ReactNode | string;
}
export const SensitiveContent: FC<SensitiveContent> = ({ children }) => {
  const [{ isSensitiveHidden }] = useApplicationSettings();
  return (
    <span
      style={
        isSensitiveHidden
          ? {
              filter: 'blur(7px)',
              userSelect: 'none',
            }
          : {}
      }
    >
      {children}
    </span>
  );
};
