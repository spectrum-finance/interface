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

import { FarmStatus } from '../../../../common/models/Farm';
import { FarmStateCaptions } from './FarmState';

const StyledButton = styled(Button)`
  padding: 0 8px;
`;

export interface FarmStateFilterProps {
  readonly value: FarmStatus;
  readonly onChange: (value: FarmStatus) => void;
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
            <Menu.Item onClick={() => onChange(FarmStatus.All)}>
              {FarmStateCaptions[FarmStatus.All]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Live)}>
              {FarmStateCaptions[FarmStatus.Live]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Scheduled)}>
              {FarmStateCaptions[FarmStatus.Scheduled]}
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Finished)}>
              {FarmStateCaptions[FarmStatus.Finished]}
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
