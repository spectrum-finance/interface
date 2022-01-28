import React from 'react';

type TokenIconProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  name?: string;
  size?: 'large';
};

const accessibleTokens = [
  'ERG',
  'ERGX',
  'ADA',
  'SigUSD',
  'SigRSV',
  'Kushti',
  'Erdoge',
  'NETA',
  'ADA-disabled',
  'LunaDog',
];

const TokenIcon: React.FC<TokenIconProps> = ({ name, size, ...rest }) => {
  const isAccessibleToken = accessibleTokens.some(
    (tokenName) => tokenName.toLowerCase() === name?.toLocaleLowerCase(),
  );

  return (
    <span
      role="img"
      className={`token-icon token-icon-${name?.toLowerCase()}`}
      style={{
        display: 'inherit',
        width: size === 'large' ? 32 : 24,
        height: size === 'large' ? 32 : 24,
      }}
      {...rest}
    >
      <img
        src={`/assets/tokens/token-${
          name && isAccessibleToken ? name.toLowerCase() : 'empty'
        }.svg`}
        width={size === 'large' ? 32 : 24}
        height={size === 'large' ? 32 : 24}
      />
    </span>
  );
};

export { TokenIcon };
