import { Control, Tabs } from '@ergolabs/ui-kit';
import React, { FC } from 'react';
import styled from 'styled-components';

import { AssetInfo } from '../../../common/models/AssetInfo';
import { NewFeatureTag } from '../../NewFeatureTag/NewFeatureTag';

export type FeeCurrencySelector = Control<AssetInfo> & {
  readonly assets: AssetInfo[];
};

const RelativeWrapper = styled.div`
  position: relative;
`;

export const FeeCurrencySelector: FC<FeeCurrencySelector> = ({
  onChange,
  value,
  assets,
}) => {
  const handleTabChange = (assetId: string): void => {
    const asset = assets.find((asset) => asset.id === assetId);
    if (asset && onChange) {
      onChange(asset);
    }
  };

  return (
    <RelativeWrapper>
      <NewFeatureTag left={115} />
      <Tabs onChange={handleTabChange} activeKey={value?.id}>
        {assets.map((ai) => {
          return <Tabs.TabPane tab={ai.ticker} key={ai.id} />;
        })}
      </Tabs>
    </RelativeWrapper>
  );
};
