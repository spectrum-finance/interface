import './Page.less';

import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import {
  ArrowLeftOutlined,
  Box,
  Button,
  Flex,
  Typography,
} from '../../ergodex-cdk';
import { Gutter } from '../../ergodex-cdk/utils/gutter';

interface PageProps {
  width?: number;
  title?: ReactNode | ReactNode[] | string;
  withBackButton?: boolean;
  backTo?: string;
  onBackButtonClick?: () => void;
  titleChildren?: ReactNode | ReactNode[] | string;
  className?: string;
  footer?: ReactNode | ReactNode[] | string;
  padding?: Gutter;
}

const _Page: React.FC<PageProps> = ({
  children,
  width,
  title,
  withBackButton,
  backTo,
  footer,
  className,
  titleChildren,
  onBackButtonClick,
  padding,
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
                        onClick={() => {
                          history.length
                            ? history.goBack()
                            : backTo && history.push(backTo);
                          onBackButtonClick && onBackButtonClick();
                        }}
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
        <Flex.Item style={{ zIndex: 2 }}>
          <Box
            bordered={false}
            className={className}
            padding={padding ? padding : [6, 6]}
            borderRadius="l"
          >
            {children}
          </Box>
        </Flex.Item>
        <Flex.Item style={{ zIndex: 0 }}>{footer}</Flex.Item>
      </Flex>
    </Flex>
  );
};

export const Page = styled(_Page)`
  box-shadow: var(--ergo-box-box-shadow-form-wrapper);
`;
