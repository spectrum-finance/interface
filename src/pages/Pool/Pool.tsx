import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ConnectWalletButton } from '../../components/common/ConnectWalletButton/ConnectWalletButton';
import { FormPageWrapper } from '../../components/FormPageWrapper/FormPageWrapper';
import { WalletContext } from '../../context';
import { Button, Flex, PlusOutlined, Typography } from '../../ergodex-cdk';
import { useObservable } from '../../hooks/useObservable';
import { availablePools$ } from '../../services/new/pools';
import { EmptyPositionsWrapper } from './components/EmptyPositionsWrapper/EmptyPositionsWrapper';
import { LiquidityPositionsList } from './components/LiquidityPositionsList/LiquidityPositionsList';
import { PositionListLoader } from './components/PositionListLoader/PositionListLoader';
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
  const { isWalletConnected } = useContext(WalletContext);

  const [pools, loading] = useObservable(availablePools$, {
    defaultValue: [],
  });

  const history = useHistory();

  function handleAddLiquidity() {
    history.push('/pool/add');
  }

  if (loading) {
    return (
      <PoolPageWrapper
        isWalletConnected={isWalletConnected}
        onClick={handleAddLiquidity}
      >
        <PositionListLoader />
      </PoolPageWrapper>
    );
  }

  if (!isWalletConnected) {
    return (
      <PoolPageWrapper
        isWalletConnected={isWalletConnected}
        onClick={handleAddLiquidity}
      >
        <EmptyPositionsWrapper>
          <ConnectWalletButton />
        </EmptyPositionsWrapper>
      </PoolPageWrapper>
    );
  }

  if (isEmpty(pools) && !loading) {
    return (
      <PoolPageWrapper
        isWalletConnected={isWalletConnected}
        onClick={handleAddLiquidity}
      >
        <EmptyPositionsWrapper>
          <Button
            type="primary"
            size="middle"
            onClick={handleAddLiquidity}
            icon={<PlusOutlined />}
          >
            Add Position
          </Button>
        </EmptyPositionsWrapper>
      </PoolPageWrapper>
    );
  }

  return (
    <PoolPageWrapper
      isWalletConnected={isWalletConnected}
      onClick={handleAddLiquidity}
    >
      <Flex col>
        <Flex.Item marginBottom={2}>
          <Typography.Title level={5}>Your positions</Typography.Title>
        </Flex.Item>
        <LiquidityPositionsList pools={pools} />
      </Flex>
    </PoolPageWrapper>
  );
};

export { Pool };
