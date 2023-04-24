import { Box, Checkbox, Control, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../../../../../common/models/AssetInfo';
import { AssetTitle } from '../../../../../../AssetTitle/AssetTitle';

export interface ImportTokenPairSelectControlProps
  extends Control<AssetInfo[]> {
  readonly assets: AssetInfo[];
  readonly mainAsset: AssetInfo;
}

const StyledCheckbox = styled(Checkbox)`
  align-items: center;
  display: inline-flex;
  user-select: none;

  .ant-checkbox {
    top: 0;
  }
`;

export const ImportTokenPairSelectControl: FC<ImportTokenPairSelectControlProps> =
  ({ onChange, value, assets, mainAsset }) => {
    const handleAssetChange = (asset: AssetInfo, checked: boolean) => {
      if (!onChange) {
        return;
      }
      if (checked) {
        onChange((value || []).concat(asset));
      } else {
        onChange((value || []).filter((i) => i.id !== asset.id));
      }
    };

    const handleSelectAllChange = (checked: boolean) => {
      if (!onChange) {
        return;
      }
      if (checked) {
        onChange(assets);
      } else {
        onChange([]);
      }
    };

    const isAssetChecked = (asset: AssetInfo) => {
      return value?.some((i) => i.id === asset.id);
    };

    const isSelectAllIndeterminate =
      !!value?.length && value.length < assets.length;
    const isSelectedAllChecked = value?.length === assets.length;

    return (
      <Box secondary padding={[2, 3]} borderRadius="l">
        <Flex col>
          <Flex.Item marginBottom={4}>
            <Typography.Body>
              <Trans>
                Import at least one token from the list to perform operations
                with {mainAsset.ticker} token
              </Trans>
            </Typography.Body>
          </Flex.Item>
          <Flex.Item marginBottom={4}>
            <Checkbox
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectedAllChecked}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
            >
              <Trans>Select all</Trans>
            </Checkbox>
          </Flex.Item>

          {assets.map((asset, index) => (
            <Flex.Item
              key={asset.id}
              marginBottom={index === assets.length - 1 ? 0 : 2}
            >
              <Box transparent padding={[1, 6]} bordered={false}>
                <StyledCheckbox
                  checked={isAssetChecked(asset)}
                  onChange={(e) => handleAssetChange(asset, e.target.checked)}
                >
                  <AssetTitle
                    size="extraSmall"
                    asset={asset}
                    level="body-secondary"
                  />
                </StyledCheckbox>
              </Box>
            </Flex.Item>
          ))}
        </Flex>
      </Box>
    );
  };
