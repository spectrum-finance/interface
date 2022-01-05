import React from 'react';
import { useHistory } from 'react-router-dom';

import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { Button, Flex, PlusOutlined } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { isWalletSetuped$ } from '../../services/new/core';
import { EmptyPositionsWrapper } from './components/EmptyPositionsWrapper/EmptyPositionsWrapper';
import { LiquidityPositionsList } from './components/LiquidityPositionsList/LiquidityPositionsList';

// import { LPGuide } from './LPGuide/LPGuide';

interface PoolPageWrapperProps {
  children?: React.ReactChild | React.ReactChild[];
  isWalletConnected: boolean;
  onClick: () => void;
}

const PoolPageWrapper: React.FC<PoolPageWrapperProps> = ({
  children,
  isWalletConnected,
  onClick,
}) => {
  return (
    <Flex col>
      <Flex.Item marginBottom={isWalletConnected ? 2 : 0}>
        <FormPageWrapper
          width={832}
          title="Pools overview"
          bottomChildren={
            isWalletConnected && (
              <Button
                type="primary"
                size="extra-large"
                onClick={onClick}
                icon={<PlusOutlined />}
                block
              >
                Add Position
              </Button>
            )
          }
        >
          {children}
        </FormPageWrapper>
      </Flex.Item>
    </Flex>
  );
};

const Pool = (): JSX.Element => {
  const [isWalletConnected] = useObservable(isWalletSetuped$, {
    defaultValue: false,
  });

  const history = useHistory();

  function handleAddLiquidity() {
    history.push('/pool/add');
  }

  return (
    <PoolPageWrapper
      isWalletConnected={isWalletConnected}
      onClick={handleAddLiquidity}
    >
      {isWalletConnected ? (
        <LiquidityPositionsList />
      ) : (
        <EmptyPositionsWrapper>
          <ConnectWalletButton />
        </EmptyPositionsWrapper>
      )}
    </PoolPageWrapper>
  );
};

export { Pool };
