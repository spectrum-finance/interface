import { Trans } from '@lingui/macro';
import { evaluate } from 'mathjs';
import React, { useEffect, useState } from 'react';

import { useObservable } from '../../common/hooks/useObservable';
import {
  Button,
  DownOutlined,
  Dropdown,
  Flex,
  Menu,
  Modal,
} from '../../ergodex-cdk';
import {
  getAvailableTestnetTokensList,
  getTestnetTokens,
} from '../../network/cardano/api/faucet/faucet';

interface FaucetModalProps {
  close: (result?: boolean) => void;
}

interface TestToken {
  dripAmount: number;
  dripAsset: {
    unAssetClass: [{ unCurrencySymbol: string }, { unTokenName: string }];
  };
}

const convertAmount = (a: number) => `${evaluate(`${a} / 1000000`)}.00`;

const FaucetModal: React.FC<FaucetModalProps> = ({ close }) => {
  const [availableTestnetTokens] = useObservable(
    getAvailableTestnetTokensList(),
    [],
  );
  const [activeToken, setActiveToken] = useState<TestToken>();

  useEffect(() => {
    if (availableTestnetTokens) {
      setActiveToken(availableTestnetTokens[0]);
    }
  }, [availableTestnetTokens]);

  const getTokens = () => {
    if (activeToken) {
      getTestnetTokens(
        `${activeToken.dripAsset.unAssetClass[0].unCurrencySymbol}.${activeToken.dripAsset.unAssetClass[1].unTokenName}`,
      ).subscribe(() => {
        // TODO: add logic to never open notification message
      });
    }
    close(true);
  };

  return (
    <>
      <Modal.Title>
        <Trans>Get testnet tokens</Trans>
      </Modal.Title>
      <Modal.Content width={470}>
        <Flex col>
          <Flex.Item marginBottom={2}>
            {availableTestnetTokens && activeToken && (
              <Dropdown
                overlay={
                  <Menu>
                    {availableTestnetTokens.map(
                      (token: TestToken, i: number) => {
                        return (
                          <Menu.Item
                            key={i}
                            onClick={() => setActiveToken(token)}
                          >
                            {`${
                              token.dripAsset.unAssetClass[1].unTokenName
                            }: ${convertAmount(token.dripAmount)}`}
                          </Menu.Item>
                        );
                      },
                    )}
                  </Menu>
                }
                trigger={['click']}
              >
                <Button
                  size="large"
                  block
                  style={{ padding: '0 12px', textAlign: 'left' }}
                  disabled
                >
                  <Flex justify="space-between">
                    <Flex.Item marginRight={2} grow>
                      {`${
                        activeToken.dripAsset.unAssetClass[1].unTokenName
                      }: ${convertAmount(activeToken.dripAmount)}`}
                    </Flex.Item>
                    <Flex.Item>
                      <Flex align="center" style={{ height: '100%' }}>
                        <DownOutlined />
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Button>
              </Dropdown>
            )}
          </Flex.Item>
          <Flex.Item>
            <Button onClick={getTokens} type="primary" block size="extra-large">
              <Trans>Get testnet tokens</Trans>
            </Button>
          </Flex.Item>
        </Flex>
      </Modal.Content>
    </>
  );
};

export { FaucetModal };
