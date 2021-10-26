import React from 'react';

import sprite from '../../assets/icons/sprite/sprite.svg';

interface TokenIconProps extends SVGSVGElement {
  name?: string;
}

const accessibleTokens = [
  'ERG',
  'ADA',
  'ERG-ORANGE',
  'ADA-DISABLED',
  'ERG-ORANGE-DISABLED',
];

const TokenIcon: React.FC<React.SVGProps<TokenIconProps>> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      className={`token-icon token-icon-${props.name}`}
      {...props}
    >
      <use
        xlinkHref={`${sprite}#token-${
          props.name && accessibleTokens.includes(props.name?.toUpperCase())
            ? props.name.toLowerCase()
            : 'empty'
        }`}
      />
    </svg>
  );
};

export { TokenIcon };
