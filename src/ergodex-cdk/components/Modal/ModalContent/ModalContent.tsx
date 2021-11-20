import React, { FC, PropsWithChildren } from 'react';

export const ModalContent: FC<PropsWithChildren<{ width?: number | string }>> =
  ({ children, width }) => (
    <div style={{ width, padding: '0 24px 24px' }}>{children}</div>
  );
