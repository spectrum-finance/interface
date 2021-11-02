import React from 'react';

import sprite from '../../assets/icons/sprite/sprite.svg';

interface TokenIconProps extends SVGSVGElement {
  name?: string;
}

const accessibleTokens = [
  'ERG',
  'ADA',
  'SigUSD',
  'SigRSV',
  'Kushti',
  'Erdoge',
  'ADA-disabled',
];

const TokenIcon: React.FC<React.SVGProps<TokenIconProps>> = (props) => {
  const isAccessibleToken = accessibleTokens.some(
    (tokenName) => tokenName.toLowerCase() === props.name?.toLocaleLowerCase(),
  );

  return (
    <svg
      style={{ display: 'block' }}
      width="24"
      height="24"
      className={`token-icon token-icon-${props.name?.toLowerCase()}`}
      {...props}
    >
      <use
        xlinkHref={`${sprite}#token-${
          props.name && isAccessibleToken ? props.name.toLowerCase() : 'empty'
        }`}
      />
    </svg>
  );
};

export { TokenIcon };
