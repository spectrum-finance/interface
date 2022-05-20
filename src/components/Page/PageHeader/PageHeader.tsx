import React, { ReactNode } from 'react';

import { Position } from '../../../common/models/Position';
import { Flex, Typography } from '../../../ergodex-cdk';
import { TokenIconPair } from '../../AssetIconPair/TokenIconPair';
import { OptionsButton } from '../../common/OptionsButton/OptionsButton';
import { Truncate } from '../../Truncate/Truncate';
import { VerificationMark } from '../../VerificationMark/VerificationMark';
interface FormHeaderProps {
  position: Position;
  actionsMenu?: ReactNode | ReactNode[] | undefined;
  actionsMenuWidth?: number;
  children?: ReactNode | ReactNode[] | undefined;
}

const PageHeader: React.FC<FormHeaderProps> = ({
  position,
  actionsMenu,
  actionsMenuWidth,
  children,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex align="center">
        <Flex.Item display="flex" marginRight={2}>
          <TokenIconPair
            assetX={position.availableX.asset}
            assetY={position.availableY.asset}
          />
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <Typography.Title level={4}>
            <Truncate>{position.availableX.asset.name}</Truncate> /{' '}
            <Truncate>{position.availableY.asset.name}</Truncate>
          </Typography.Title>
        </Flex.Item>
        {position.verified && (
          <Flex.Item marginRight={children ? 2 : 0} align="center">
            <VerificationMark />
          </Flex.Item>
        )}
        {children}
      </Flex>
      {actionsMenu && (
        <OptionsButton width={actionsMenuWidth}>{actionsMenu}</OptionsButton>
      )}
    </Flex>
  );
};

export { PageHeader };
