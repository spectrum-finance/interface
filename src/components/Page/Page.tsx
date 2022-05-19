import './Page.less';

import React, { ReactNode, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  Box,
  Button,
  Flex,
  LeftOutlined,
  LineChartOutlined,
  RightOutlined,
  Typography,
} from 'src/ergodex-cdk';
import styled from 'styled-components';

import { Gutter } from '../../ergodex-cdk/utils/gutter';
import { Tongue } from './Tongue/Tongue';

interface PageProps {
  width?: number;
  title?: ReactNode | ReactNode[] | string;
  withBackButton?: boolean;
  leftWidget?: ReactNode;
  leftWidgetDisabled?: boolean;
  backTo?: string;
  onBackButtonClick?: () => void;
  titleChildren?: ReactNode | ReactNode[] | string;
  className?: string;
  footer?: ReactNode | ReactNode[] | string;
  padding?: Gutter;
}

const Widget = styled.div`
  background: var(--ergo-page-footer-bg);
  border-radius: 16px 0 0 16px;
  margin: 16px 0;
`;

const _Page: React.FC<PageProps> = ({
  children,
  width,
  title,
  withBackButton,
  leftWidget,
  backTo,
  footer,
  className,
  titleChildren,
  onBackButtonClick,
  padding,
}) => {
  const history = useHistory();
  const [leftWidgetOpened, setLeftWidgetOpened] = useState<boolean>(false);

  return (
    <Flex
      className="ergodex-form-page-wrapper"
      justify="center"
      align="flex-start"
    >
      <Flex
        col
        align="center"
        style={{
          position: 'relative',
        }}
      >
        {leftWidget && (
          <Tongue
            style={{
              top: '32px',
              position: 'absolute',
              left: '-66px',
            }}
            arrow={leftWidgetOpened ? <RightOutlined /> : <LeftOutlined />}
            icon={<LineChartOutlined size={16} />}
            iconDisabled
            onClick={() => {
              setLeftWidgetOpened(!leftWidgetOpened);
            }}
          />
        )}
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
          <Flex justify="center">
            {leftWidgetOpened && <Widget>{leftWidget}</Widget>}
            <Box
              bordered={false}
              className={className}
              padding={padding ? padding : [6, 6]}
              borderRadius="l"
              width={width ?? 0}
            >
              {children}
            </Box>
          </Flex>
        </Flex.Item>
        <Flex.Item style={{ zIndex: 0 }}>{footer}</Flex.Item>
      </Flex>
    </Flex>
  );
};

export const Page = styled(_Page)`
  box-shadow: var(--ergo-box-box-shadow-form-wrapper);
`;
