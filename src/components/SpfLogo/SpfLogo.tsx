import { FC } from 'react';

interface SpfLogoProps {
  w?: number;
  h?: number;
}

export const SpfLogo: FC<SpfLogoProps> = ({ w = 24, h = 24 }) => {
  return (
    <img
      style={{ display: 'block' }}
      src="/spectrum-finance-token-logo.svg"
      alt="SPF Logo"
      width={w}
      height={h}
    />
  );
};
