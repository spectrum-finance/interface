import { DownOutlined, Dropdown, Menu } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledMenu = styled(Menu)`
  padding: calc(var(--ergo-base-gutter) * 2);
  width: 200px;
`;

export const LiquidityTitleExtra: FC = () => {
  const navigate = useNavigate();

  const navigateToAddLiquidity = () => navigate('add');

  return (
    <Dropdown.Button
      type="primary"
      icon={<DownOutlined />}
      size="middle"
      overlay={
        <StyledMenu>
          <Menu.Item key="1">
            <Link to="create">
              <Trans>Create pool</Trans>
            </Link>
          </Menu.Item>
        </StyledMenu>
      }
      trigger={['click']}
      onClick={navigateToAddLiquidity}
    >
      <Trans>Add liquidity</Trans>
    </Dropdown.Button>
  );
};
