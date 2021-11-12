import React from 'react';

import sprite from '../../assets/icons/sprite/sprite.svg';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  name?: string;
  size?: 'large';
};

const accessibleTokens = [
  'ERG',
  'ADA',
  'SigUSD',
  'SigRSV',
  'Kushti',
  'Erdoge',
  'ADA-disabled',
];

const TokenIcon: React.FC<TokenIconProps> = ({ name, size }) => {
  const isAccessibleToken = accessibleTokens.some(
    (tokenName) => tokenName.toLowerCase() === name?.toLocaleLowerCase(),
  );

  return (
    <span
      role="img"
      className={`token-icon token-icon-${name?.toLowerCase()}`}
      style={{ display: 'inherit' }}
    >
      <svg
        width={size === 'large' ? 32 : 24}
        height={size === 'large' ? 32 : 24}
      >
        <use
          xlinkHref={`${sprite}#token-${
            name && isAccessibleToken ? name.toLowerCase() : 'empty'
          }`}
        />
      </svg>
    </span>
  );
};

export { TokenIcon };
