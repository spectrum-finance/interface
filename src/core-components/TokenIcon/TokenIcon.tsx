import React from 'react';

import sprite from '../../assets/icons/sprite/sprite.svg';

interface TokenIconProps extends SVGSVGElement {
  name?: string;
}

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
          props.name ? props.name.toLowerCase() : 'empty'
        }`}
      />
    </svg>
  );
};

export { TokenIcon };
