import './FormPageWrapper.less';

import React, { JSXElementConstructor, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as Santa } from '../../assets/images/santa.svg';
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
  bottomChildren?:
    | ReactElement<any>
    | JSXElementConstructor<any>
    | undefined
    | boolean;
}

const FormPageWrapper: React.FC<FormPageWrapperProps> = ({
  children,
  width,
  title,
  withBackButton,
  backTo,
  bottomChildren,
}) => {
  const history = useHistory();

  return (
    <Flex justify="center" align="center">
      <Flex direction="col" style={{ width: width ?? '100%' }}>
        {title && (
          <Flex.Item marginBottom={2}>
            <Box transparent>
              <Flex align="center">
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
        <Flex.Item marginBottom={bottomChildren ? 2 : 0}>
          <Box
            className="ergodex-form-wrapper"
            formWrapper
            padding={[6, 6]}
            borderRadius="m"
          >
            <Santa className="santa-icon" />
            {children}
          </Box>
        </Flex.Item>
        <Flex.Item>{bottomChildren}</Flex.Item>
      </Flex>
    </Flex>
  );
};

export { FormPageWrapper };
