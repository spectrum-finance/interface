import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { FC, ReactNode } from 'react';

import { Currency } from '../../../../../../common/models/Currency';
import { ConvenientAssetView } from '../../../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InfoTooltip } from '../../../../../../components/InfoTooltip/InfoTooltip';

export interface UsdCellProps {
  readonly label: ReactNode | ReactNode[] | string;
  readonly x: Currency;
  readonly y: Currency;
}

export const UsdCell: FC<UsdCellProps> = ({ label, x, y }) => (
  <Box width="100%" height="100%" transparent bordered={false} padding={[0, 4]}>
    <Flex col justify="center" stretch>
      <Typography.Body secondary size="small">
        {label}
      </Typography.Body>
      <Flex.Item display="flex" align="center">
        {[x, y].every((value) => value.isPositive()) ? (
          <>
            <Flex.Item marginRight={1}>
              <Typography.Body strong>
                <ConvenientAssetView value={[x, y]} />
              </Typography.Body>
            </Flex.Item>
            <InfoTooltip
              width={194}
              size="small"
              placement="top"
              content={
                <>
                  {x.asset.ticker}: {x.toString()}
                  <br />
                  {y.asset.ticker}: {y.toString()}
                </>
              }
            />
          </>
        ) : (
          <Typography.Body strong>$---</Typography.Body>
        )}
      </Flex.Item>
    </Flex>
  </Box>
);
