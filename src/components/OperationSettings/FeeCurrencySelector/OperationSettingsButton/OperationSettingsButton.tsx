import { Button, Flex, SettingOutlined, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

interface OperationSettingsButton {
  className?: string;
  slippage: number;
}

const _OperationSettingsButton: FC<OperationSettingsButton> = ({
  className,
  slippage,
}) => {
  return (
    <Button className={className} type="text" size="large">
      <Flex align="center">
        <Flex.Item marginRight={2} align="center">
          <Typography.Body size="small">
            {`${slippage}% `}
            <Trans>slippage</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item align="center" style={{ paddingTop: '1px' }}>
          <SettingOutlined />
        </Flex.Item>
      </Flex>
    </Button>
  );
};

export const OperationSettingsButton = styled(_OperationSettingsButton)`
  background-color: var(--spectrum-primary-color) !important;
`;
