import { ButtonProps, Flex, Typography } from '@ergolabs/ui-kit';
import React, { ReactNode } from 'react';

import { Position } from '../../../common/models/Position';
import { AssetIconPair } from '../../AssetIconPair/AssetIconPair';
import { OptionsButton } from '../../common/OptionsButton/OptionsButton';
import { Truncate } from '../../Truncate/Truncate';

interface FormHeaderProps {
  position: Position;
  actionsMenu?: ReactNode | ReactNode[] | undefined;
  actionsMenuWidth?: number;
  children?: ReactNode | ReactNode[] | undefined;
  actionButtonSize?: ButtonProps['size'];
  level?: 4 | 3;
}

const PageHeader: React.FC<FormHeaderProps> = ({
  position,
  actionsMenu,
  actionsMenuWidth,
  children,
  level,
  actionButtonSize,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex.Item display="flex" align="center" marginRight={2} flex={1}>
        <Flex.Item display="flex" marginRight={2}>
          <AssetIconPair
            assetX={position.availableX.asset}
            assetY={position.availableY.asset}
          />
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <Typography.Title level={level || 4}>
            <Truncate>{position.availableX.asset.ticker}</Truncate> /{' '}
            <Truncate>{position.availableY.asset.ticker}</Truncate>
          </Typography.Title>
        </Flex.Item>
        <Flex.Item flex={1}>{children}</Flex.Item>
      </Flex.Item>
      {actionsMenu && (
        <OptionsButton size={actionButtonSize} width={actionsMenuWidth}>
          {actionsMenu}
        </OptionsButton>
      )}
    </Flex>
  );
};

export { PageHeader };
