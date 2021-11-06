import { useEffect, useState } from 'react';

import { getListAvailableTokens } from '../utils/getListAvailableTokens';
import { AssetDictionary } from '../utils/getListAvailableTokens';
import { useUTXOs } from './useUTXOs';

export const useAvailableTokens = (): AssetDictionary => {
  const [assets, setAssets] = useState<AssetDictionary>({});
  const UTXOs = useUTXOs();

  useEffect(() => {
    if (UTXOs.length > 0) {
      setAssets(getListAvailableTokens(UTXOs));
    }
  }, [UTXOs]);

  return assets;
};
