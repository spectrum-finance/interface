import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  ArrowLeftOutlined,
  Box,
  Button,
  Flex,
  Typography,
} from '../../ergodex-cdk';

interface FormPageWrapperProps {
  width?: number;
  title?: string;
  withBackButton?: boolean;
  backTo?: string;
}

const FormPageWrapper: React.FC<FormPageWrapperProps> = ({
  children,
  width,
  title,
  withBackButton,
  backTo,
}) => {
  const history = useHistory();

  return (
    <Flex justify="center" alignItems="center">
      <Flex flexDirection="col" style={{ width: width ?? '100%' }}>
        {title && (
          <Flex.Item marginBottom={2}>
            <Box transparent>
              <Flex alignItems="center">
                {withBackButton && (
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() =>
                      backTo ? history.push(backTo) : history.goBack()
                    }
                  />
                )}
                <Typography.Title level={4}>{title}</Typography.Title>
              </Flex>
            </Box>
          </Flex.Item>
        )}
        <Flex.Item>
          <Box formWrapper padding={[6, 6]} borderRadius="m">
            {children}
          </Box>
        </Flex.Item>
      </Flex>
    </Flex>
  );
};

export { FormPageWrapper };
