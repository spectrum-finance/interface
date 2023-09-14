import { FC, ReactNode } from 'react';

export interface OverlayProps {
  readonly enabled?: boolean;
  readonly children?: ReactNode | ReactNode[] | string;
}

export const Overlay: FC<OverlayProps> = ({ children, enabled }) => (
  <div style={{ position: 'relative' }}>
    {enabled && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      />
    )}
    <div style={{ opacity: enabled ? 0.2 : undefined }}>{children}</div>
  </div>
);
