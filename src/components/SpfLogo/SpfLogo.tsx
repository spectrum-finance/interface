import { FC } from 'react';

interface SpfLogoProps {
  w?: number;
  h?: number;
  block?: boolean;
}

export const SpfLogo: FC<SpfLogoProps> = ({ w = 24, h = 24, block }) => {
  return (
    <img
      style={{ display: block ? 'block' : 'inline' }}
      src="/spectrum-finance-token-logo.svg"
      alt="SPF Logo"
      width={w}
      height={h}
    />
  );
};
