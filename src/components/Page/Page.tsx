import './Page.less';

import {
  ArrowLeftOutlined,
  Box,
  Button,
  Flex,
  Gutter,
  Pane,
  Typography,
  useDevice,
} from '@ergolabs/ui-kit';
import React, { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

class Portal extends React.Component<{ root: HTMLElement }> {
  render() {
    const { children, root } = this.props;
    return createPortal(children, root);
  }
}

interface PageProps {
  width?: CSSProperties['width'];
  maxWidth?: CSSProperties['maxWidth'];
  title?: ReactNode | ReactNode[] | string;
  withBackButton?: boolean;
  leftWidget?: ReactNode;
  widgetOpened?: boolean;
  onWidgetClose?: () => void;
  backTo?: string;
  onBackButtonClick?: () => void;
  titleChildren?: ReactNode | ReactNode[] | string;
  className?: string;
  footer?: ReactNode | ReactNode[] | string;
  padding?: Gutter;
}

const Widget = styled.div`
  background: var(--spectrum-page-footer-bg);
  border-radius: 4px 0 0 4px;
  margin: 16px 0;
  width: 100%;
`;

const _Page: React.FC<PageProps> = ({
  children,
  width,
  maxWidth,
  title,
  withBackButton,
  leftWidget,
  widgetOpened,
  onWidgetClose,
  backTo,
  footer,
  className,
  titleChildren,
  onBackButtonClick,
  padding,
}) => {
  const navigate = useNavigate();
  const { valBySize, s, m } = useDevice();

  return (
    <Flex
      className="ergodex-form-page-wrapper"
      justify="center"
      align="flex-start"
      width="100%"
    >
      <Flex col align="center" position="relative" width="100%">
        {title && (
          <Flex.Item
            marginBottom={2}
            flex={1}
            style={{ width: maxWidth ? '100%' : width ?? 0, maxWidth }}
          >
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
                            ? navigate(-1)
                            : backTo && navigate(backTo);
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
        <Flex justify="center" align="flex-start" width="100%">
          {(s || m) && (
            <Portal root={document.body}>
              <Pane
                visible={widgetOpened}
                events={{
                  onBackdropTap: () => onWidgetClose?.(),
                  onDidDismiss: () => onWidgetClose?.(),
                }}
              >
                {leftWidget}
              </Pane>
            </Portal>
          )}
          {!(s || m) && widgetOpened && (
            <Widget
              style={{
                maxWidth: valBySize(undefined, undefined, 624),
              }}
            >
              {leftWidget}
            </Widget>
          )}
          <Flex col style={{ width: maxWidth ? '100%' : width ?? 0, maxWidth }}>
            <Flex.Item style={{ zIndex: 2 }} width="100%">
              <Box
                bordered={false}
                className={className}
                padding={padding ? padding : valBySize([4, 4], [6, 6])}
                borderRadius="l"
                width="100%"
              >
                {children}
              </Box>
            </Flex.Item>
            <Flex.Item style={{ zIndex: 0 }}>{footer}</Flex.Item>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Page = styled(_Page)`
  box-shadow: var(--spectrum-box-box-shadow-form-wrapper);
`;
