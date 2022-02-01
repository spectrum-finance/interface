import React, { ReactNode } from 'react';

import { Currency } from '../../../common/models/Currency';
import { Flex, Typography } from '../../../ergodex-cdk';
import { OptionsButton } from '../../common/OptionsButton/OptionsButton';
import { TokenIconPair } from '../../TokenIconPair/TokenIconPair';

interface FormHeaderProps {
  x: Currency;
  y: Currency;
  actionsMenu?: ReactNode | ReactNode[] | undefined;
  children?: ReactNode | ReactNode[] | undefined;
}

const PageHeader: React.FC<FormHeaderProps> = ({
  x,
  y,
  actionsMenu,
  children,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <Flex align="center">
        <Flex.Item display="flex" marginRight={2}>
          <TokenIconPair
            tokenPair={{
              tokenA: x.asset.name,
              tokenB: y.asset.name,
            }}
          />
        </Flex.Item>
        <Flex.Item marginRight={2}>
          <Typography.Title level={4}>
            {x.asset.name} / {y.asset.name}
          </Typography.Title>
        </Flex.Item>
        {children}
      </Flex>
      {actionsMenu && <OptionsButton>{actionsMenu}</OptionsButton>}
    </Flex>
  );
};

export { PageHeader };
