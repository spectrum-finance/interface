import {
  Button,
  DownOutlined,
  Dropdown,
  Menu,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { FarmState, FarmStateCaptions } from './FarmState';

const StyledButton = styled(Button)`
  padding: 0 8px;
`;

export interface FarmStateFilterProps {
  readonly value: FarmState;
  readonly onChange: (value: FarmState) => void;
}

export const FarmStateFilter: FC<FarmStateFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <>
      <Typography.Body>
        <Trans>Farms status</Trans>
      </Typography.Body>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={() => onChange(FarmState.All)}>
              {FarmStateCaptions[FarmState.All]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmState.Live)}>
              {FarmStateCaptions[FarmState.Live]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmState.Scheduled)}>
              {FarmStateCaptions[FarmState.Scheduled]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmState.Finished)}>
              {FarmStateCaptions[FarmState.Finished]}
            </Menu.Item>
          </Menu>
        }
      >
        <StyledButton type="link">
          {value} <DownOutlined />
        </StyledButton>
      </Dropdown>
    </>
  );
};
