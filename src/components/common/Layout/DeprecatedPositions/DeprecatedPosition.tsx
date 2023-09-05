import {
  Alert,
  Button,
  Flex,
  Typography,
  WarningFilled,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useObservable } from '../../../../common/hooks/useObservable';
import { Position } from '../../../../common/models/Position';
import { isDeprecatedPool } from '../../../../common/utils/isDeprecatedPool';
import { positions$ } from '../../../../gateway/api/positions';

const StyledAlert = styled(Alert)`
  border-radius: 0 !important;
  padding: 0 !important;
`;

export const DeprecatedPosition: FC = () => {
  const navigate = useNavigate();
  const [positions] = useObservable<Position[]>(positions$, []);

  const hasDeprecatedPositions = positions?.some((p) =>
    isDeprecatedPool(p.pool.id),
  );

  return (
    <>
      {hasDeprecatedPositions && (
        <StyledAlert
          type="warning"
          description={
            <Flex align="center" stretch justify="center">
              <Typography.Body size="small" type="warning" align="center">
                <Flex.Item marginRight={1}>
                  <WarningFilled />
                </Flex.Item>
                <Trans>
                  Recently we found a minor bug in some liquidity pools. The
                  threat level is almost 0. But better
                </Trans>
                <Button
                  type="link"
                  onClick={() =>
                    navigate('/cardano/liquidity?active=your-positions')
                  }
                  style={{
                    display: 'inline',
                    padding: 0,
                    fontSize: 12,
                    marginLeft: 2,
                    height: 24,
                  }}
                >
                  <Trans>migrate</Trans>
                </Button>{' '}
                <Trans>liquidity to be</Trans> 1000% safe.{' '}
              </Typography.Body>
            </Flex>
          }
        />
      )}
    </>
  );
};
