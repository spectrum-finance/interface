import './NetworkHeight.less';

import React from 'react';
// @ts-ignore
import FlipNumbers from 'react-flip-numbers';

import { ergoExplorerContext$ } from '../../api/explorer';
import { ReactComponent as BlockIcon } from '../../assets/icons/block-icon.svg';
import { ERG_EXPLORER_URL } from '../../common/constants/env';
import { useObservable } from '../../common/hooks/useObservable';
import { Flex, Tooltip, Typography } from '../../ergodex-cdk';
import { formatToInt } from '../../services/number';
const NetworkHeight = (): JSX.Element => {
  const [network] = useObservable(ergoExplorerContext$);

  return (
    <>
      {network ? (
        <Typography.Link
          href={`${ERG_EXPLORER_URL}/blocks/${network.lastBlockId}`}
          strong
          className="network-height"
          type="success"
          target="_blank"
        >
          <Tooltip
            title="The most recent block in Ergo network"
            placement="left"
          >
            <Flex justify="space-between" align="center">
              <Flex.Item marginRight={1}>
                <FlipNumbers
                  numbers={formatToInt(network.height)}
                  play
                  perspective={100}
                  height={12}
                  width={8}
                />
              </Flex.Item>

              <BlockIcon />
            </Flex>
          </Tooltip>
        </Typography.Link>
      ) : null}
    </>
  );
};

export { NetworkHeight };
