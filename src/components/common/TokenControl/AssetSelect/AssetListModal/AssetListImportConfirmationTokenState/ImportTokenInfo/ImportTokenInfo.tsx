import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { exploreToken } from '../../../../../../../gateway/utils/exploreAddress';
import { splitStr } from '../../../../../../../utils/string/splitStr';
import { AssetIcon } from '../../../../../../AssetIcon/AssetIcon';

export interface ImportTokenInfoProps {
  readonly asset: AssetInfo;
}

const StyledButton = styled(Button)`
  width: 100%;

  span {
    color: inherit !important;
  }
`;

export const ImportTokenInfo: FC<ImportTokenInfoProps> = ({ asset }) => {
  const [idBegin, idSuffix] = splitStr(asset.id);

  return (
    <Box control padding={[4, 0]}>
      <Flex col align="center">
        <Flex.Item marginBottom={2}>
          <AssetIcon asset={asset} size="large" />
        </Flex.Item>
        <Flex.Item>
          <Typography.Title level={4}>
            {asset.ticker || asset.name}
          </Typography.Title>
        </Flex.Item>
        <Flex.Item marginBottom={2}>
          <Typography.Footnote>{asset.name}</Typography.Footnote>
        </Flex.Item>
        <StyledButton type="link" onClick={() => exploreToken(asset)}>
          <Typography.Body ellipsis={{ suffix: idSuffix }}>
            {idBegin}
          </Typography.Body>
        </StyledButton>
      </Flex>
    </Box>
  );
};
