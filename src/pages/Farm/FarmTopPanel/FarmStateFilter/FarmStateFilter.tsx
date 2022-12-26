import {
  Button,
  DownOutlined,
  Dropdown,
  Menu,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';
import styled from 'styled-components';

import { LmPoolStatus } from '../../../../common/models/LmPool';
import { FarmStateCaptions } from './FarmState';

const StyledButton = styled(Button)`
  padding: 0 8px;
`;

export interface FarmStateFilterProps {
  readonly value: LmPoolStatus;
  readonly onChange: (value: LmPoolStatus) => void;
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
            <Menu.Item onClick={() => onChange(LmPoolStatus.All)}>
              {FarmStateCaptions[LmPoolStatus.All]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(LmPoolStatus.Live)}>
              {FarmStateCaptions[LmPoolStatus.Live]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(LmPoolStatus.Scheduled)}>
              {FarmStateCaptions[LmPoolStatus.Scheduled]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(LmPoolStatus.Finished)}>
              {FarmStateCaptions[LmPoolStatus.Finished]}
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
