import './NetworkHeight.less';

import React from 'react';

import { ergoExplorerContext$ } from '../../api/explorer';
import { useObservable } from '../../common/hooks/useObservable';
import { Typography } from '../../ergodex-cdk';
import { formatToInt } from '../../services/number';
const NetworkHeight = (): JSX.Element => {
  const [network] = useObservable(ergoExplorerContext$);
  return (
    <Typography.Link className="network-height" type="success">
      {network ? formatToInt(network.height) : null}
    </Typography.Link>
  );
};

export { NetworkHeight };
