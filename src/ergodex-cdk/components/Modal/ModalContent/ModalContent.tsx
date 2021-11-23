import React, { FC, PropsWithChildren } from 'react';

export const ModalContent: FC<PropsWithChildren<{ width?: number | string }>> =
  ({ children, width }) => (
    <div style={{ width, padding: '0 16px 16px' }}>{children}</div>
  );
