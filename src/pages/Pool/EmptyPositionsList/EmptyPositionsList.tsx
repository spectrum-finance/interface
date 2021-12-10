import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Empty } from '../../../assets/icons/empty.svg';
import { ConnectWalletButton } from '../../../components/common/ConnectWalletButton/ConnectWalletButton';
import { Box, Button, Col, Row, Typography } from '../../../ergodex-cdk';

interface EmptyPositionsListProps {
  isWalletConnected: boolean;
}

const EmptyPositionsList: React.FC<EmptyPositionsListProps> = ({
  isWalletConnected,
}) => {
  const { t } = useTranslation('', { keyPrefix: 'pool' });
  return (
    <Box padding={[7, 2]} formWrapper>
      <Row justify="center" align="middle" bottomGutter={3}>
        <Col>
          <Empty />
        </Col>
      </Row>
      <Row justify="center" align="middle" bottomGutter={3}>
        <Col>
          <Typography.Body> {t('emptyList')} </Typography.Body>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col>
          {!isWalletConnected ? (
            <ConnectWalletButton />
          ) : (
            <Button type="primary">{t('newPosition')}</Button>
          )}
        </Col>
      </Row>
    </Box>
  );
};

export { EmptyPositionsList };
