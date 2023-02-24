import { Control, Tabs } from '@ergolabs/ui-kit';
import React, { FC } from 'react';

import { AssetInfo } from '../../../common/models/AssetInfo';

export type FeeCurrencySelector = Control<AssetInfo> & {
  readonly assets: AssetInfo[];
};

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
    <Tabs onChange={handleTabChange} activeKey={value?.id}>
      {assets.map((ai) => (
        <Tabs.TabPane tab={ai.ticker} key={ai.id} />
      ))}
    </Tabs>
  );
};
