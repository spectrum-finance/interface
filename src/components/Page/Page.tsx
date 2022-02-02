import './Page.less';

import React, { JSXElementConstructor, ReactElement } from 'react';
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
  titleChildren?:
    | ReactElement<any>
    | JSXElementConstructor<any>
    | undefined
    | boolean;
  bottomChildren?:
    | ReactElement<any>
    | JSXElementConstructor<any>
    | undefined
    | boolean;
}

const Page: React.FC<FormPageWrapperProps> = ({
  children,
  width,
  title,
  withBackButton,
  backTo,
  bottomChildren,
  titleChildren,
}) => {
  const history = useHistory();

  return (
    <Flex className="ergodex-form-page-wrapper" justify="center" align="center">
      <Flex direction="col" style={{ width: width ?? '100%' }}>
        {title && (
          <Flex.Item marginBottom={2}>
            <Flex align="center" justify="space-between">
              <Flex.Item>
                <Flex align="center">
                  {withBackButton && (
                    <Flex.Item marginRight={1}>
                      <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() =>
                          history.length
                            ? history.goBack()
                            : backTo && history.push(backTo)
                        }
                      />
                    </Flex.Item>
                  )}
                  <Typography.Title level={4}>{title}</Typography.Title>
                </Flex>
              </Flex.Item>

              <Flex justify="space-between">{titleChildren}</Flex>
            </Flex>
          </Flex.Item>
        )}
        <Flex.Item marginBottom={bottomChildren ? 2 : 0}>
          <Box
            className="ergodex-form-wrapper"
            formWrapper
            padding={[6, 6]}
            borderRadius="m"
          >
            {children}
          </Box>
        </Flex.Item>
        <Flex.Item>{bottomChildren}</Flex.Item>
      </Flex>
    </Flex>
  );
};

export { Page };
