import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC } from 'react';
import styled from 'styled-components';

import { colorTable } from './colorTable';

export interface UnknownTokenIconProps {
  readonly asset?: AssetInfo;
  readonly className?: string;
  readonly size: number;
}

const distance = (src: string, target: string): number => {
  if (!src.length || !target.length) {
    return 0;
  }
  return (
    distance(src.slice(2), target.slice(2)) +
    Math.abs(parseInt(src.slice(0, 2), 16) - parseInt(target.slice(0, 2), 16))
  );
};

const closestColor = (colors: string[], color: string) => {
  let min = 0xffffff;
  let best, current, i;
  for (i = 0; i < colors.length; i++) {
    current = distance(colors[i].slice(1), color.slice(1));

    if (current < min) {
      min = current;
      best = colors[i];
    }
  }
  return best;
};

const idToHex = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return closestColor(colorTable, color);
};

const _UnknownTokenIcon: FC<UnknownTokenIconProps> = ({
  asset,
  className,
  size,
}) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      background: idToHex(asset?.id || ''),
    }}
  >
    <div>
      <span />
    </div>
  </div>
);

export const UnknownTokenIcon = styled(_UnknownTokenIcon)`
  overflow: hidden;
  border-radius: 50%;
  padding: var(--ergo-base-gutter);
  z-index: 1;

  > div {
    align-items: center;
    justify-content: center;
    display: flex;
    border-radius: 50%;
    border: 2px solid #fff;
    height: 100%;
    width: 100%;

    > span {
      transform: rotate(-45deg);
      background: #fff;
      display: inline-block;
      height: 2px;
      width: 100%;
    }
  }
`;
