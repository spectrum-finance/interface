import { Button, ButtonProps, Flex } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

import { ReactComponent as XLogo } from './X.svg';
interface ShareXButtonProps {
  readonly className?: string;
  readonly size?: ButtonProps['size'];
  readonly totalSpfReward: string;
}

const _ShareXButton: FC<ShareXButtonProps> = ({
  className,
  size,
  totalSpfReward,
}) => {
  const tweetText = `I am about to get a ${totalSpfReward} $SPF reward on Cardano!\nCheck yours here: https://app.spectrum.fi/cardano/rewards\n@SpectrumLabs_`;

  return (
    <Button
      className={className}
      size={size}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText,
      )}`}
      target="_blank"
      rel="noreferrer"
    >
      <Flex align="center">
        <Flex.Item marginRight={1} display="flex">
          <XLogo style={{ fill: 'var(--spectrum-primary-text)' }} />
        </Flex.Item>
        <Flex.Item>
          <Trans>Share</Trans>
        </Flex.Item>
      </Flex>
    </Button>
  );
};

const ShareXButtonKeyframes = keyframes`
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
`;

export const ShareXButton = styled(_ShareXButton)`
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: -2px;
    top: -2px;
    background: linear-gradient(
      45deg,
      #fb0094,
      #0000ff,
      #00ff00,
      #ffff00,
      #ff0000,
      #fb0094,
      #0000ff,
      #00ff00,
      #ffff00,
      #ff0000
    );
    background-size: 400%;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    z-index: -1;
    animation: ${ShareXButtonKeyframes} 20s linear infinite;
  }

  &:after {
    filter: blur(5px);
  }

  &:hover {
    color: var(--spectrum-primary-text);
  }
`;
