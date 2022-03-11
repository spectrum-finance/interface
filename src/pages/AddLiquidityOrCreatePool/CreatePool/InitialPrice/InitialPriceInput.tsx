import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import React, { FC } from 'react';
import styled from 'styled-components';

import {
  Box,
  Button,
  ButtonProps,
  Control,
  Flex,
  Input,
  SwapOutlined,
  Typography,
} from '../../../../ergodex-cdk';

const _SwitchButton: FC<ButtonProps> = ({ ...rest }) => (
  <Button {...rest} type="primary">
    <SwapOutlined />
  </Button>
);

const SwitchButton = styled(_SwitchButton)`
  padding: 0;
  width: 2rem;
`;

export interface InitialPrice extends Control<Ratio> {
  readonly xAsset: AssetInfo;
  readonly yAsset: AssetInfo;
}

export const InitialPriceInput: FC<InitialPrice> = ({
  xAsset,
  yAsset,
  value,
  onChange,
}) => {
  return (
    <Box control padding={1}>
      <Flex align="center">
        <Flex.Item marginRight={2} flex={1}>
          <Input
            align="right"
            suffix={
              <Typography.Body>
                {xAsset?.name} per {yAsset?.name}
              </Typography.Body>
            }
          />
        </Flex.Item>
        <SwitchButton />
      </Flex>
    </Box>
  );
};
