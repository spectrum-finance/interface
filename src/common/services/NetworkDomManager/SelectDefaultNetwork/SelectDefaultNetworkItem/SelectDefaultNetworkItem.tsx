import './SelectDefaultNetworkItem.less';

import { Box, Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { AssetIcon } from '../../../../../components/AssetIcon/AssetIcon';
import { Network } from '../../../../../network/common/Network';
import cardanoBg from './cardano-bg.png';
import ergoBg from './ergo-bg.png';

interface NetworkItemHeaderProps {
  readonly network: Network<any, any>;
  readonly className?: string;
  readonly hovered?: boolean;
}
const _NetworkItemHeader: FC<NetworkItemHeaderProps> = ({
  className,
  network,
}) => {
  const { valBySize } = useDevice();

  return (
    <Flex
      align="center"
      justify="center"
      className={className}
      style={{
        height: valBySize(160),
      }}
    >
      <div />
      <img src={network.name !== 'ergo' ? cardanoBg : ergoBg} alt="" />
      <div>
        <AssetIcon
          size={valBySize('extraLarge', 'selectNetwork')}
          asset={network.networkAsset}
        />
      </div>
    </Flex>
  );
};
const NetworkItemHeader = styled(_NetworkItemHeader)`
  position: relative;
  z-index: 1;

  > div:first-child {
    background: #000;
    height: 100%;
    left: 0;
    opacity: ${(props) =>
      props.hovered
        ? 0
        : 'var(--spectrum-network-select-item-overlay-opacity)'};
    position: absolute;
    top: 0;
    transition: opacity 0.2s;
    width: 100%;
    z-index: 2;
  }

  > div:not(:first-child) {
    z-index: 3;
  }

  > img {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
  }
`;

interface NetworkItemContentProps {
  readonly network: Network<any, any>;
}

const NetworkItemContent: FC<NetworkItemContentProps> = ({ network }) => {
  const { valBySize } = useDevice();

  return (
    <Box
      padding={[valBySize(10), 0]}
      bordered={false}
      className="box-item-content"
    >
      <Flex justify="center">
        <Typography.Title level={5}>{network.label}</Typography.Title>
      </Flex>
    </Box>
  );
};

export interface SelectDefaultNetworkItemProps {
  readonly network: Network<any, any>;
  readonly className?: string;
}
const _SelectDefaultNetworkItem: FC<SelectDefaultNetworkItemProps> = ({
  network,
  className,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      bordered
      width={200}
      padding={0}
      onMouseLeave={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      overflow
      onClick={() => {}}
      className={className}
      glass
    >
      <NetworkItemHeader network={network} hovered={hovered} />
      <NetworkItemContent network={network} />
    </Box>
  );
};
export const SelectDefaultNetworkItem = styled(_SelectDefaultNetworkItem)`
  background: var(--spectrum-box-bg-glass) !important;
`;
