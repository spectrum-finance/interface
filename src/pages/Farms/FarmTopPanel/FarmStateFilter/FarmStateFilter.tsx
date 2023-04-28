import {
  Button,
  DownOutlined,
  Dropdown,
  Menu,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { FarmStatus } from '../../../../common/models/Farm';

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
              <Trans>All</Trans>
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Live)}>
              <Trans>Live</Trans>
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Scheduled)}>
              <Trans>Scheduled</Trans>
            </Menu.Item>
            <Menu.Item onClick={() => onChange(FarmStatus.Finished)}>
              <Trans>Finished</Trans>
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
