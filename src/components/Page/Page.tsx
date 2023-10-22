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
import { CSSProperties, FC, ReactNode } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

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
  transparent?: boolean;
  onWidgetClose?: () => void;
  backTo?: string;
  onBackButtonClick?: () => void;
  titleChildren?: ReactNode | ReactNode[] | string;
  className?: string;
  footer?: ReactNode | ReactNode[] | string;
  padding?: Gutter;
  widgetBaseHeight?: number;
}

const _Widget: FC<{
  className?: string;
  style?: CSSProperties;
  opened?: boolean;
  widgetBaseHeight?: number;
  children?: ReactNode | ReactNode[] | string;
}> = ({ className, style, children }) => (
  <div style={style} className={className}>
    {children}
  </div>
);

const Widget = styled(_Widget)`
  @keyframes content-width {
    from {
      overflow: hidden;
      height: ${(props) =>
        props.widgetBaseHeight ? `${props.widgetBaseHeight}px` : '436px'};
      width: 624px;
      opacity: 0;
    }
    to {
      overflow: initial;
      height: auto;
      width: 100%;
      opacity: 1;
    }
  }

  backdrop-filter: var(--spectrum-box-bg-filter);
  background: var(--spectrum-page-footer-bg);
  border-radius: 16px 0 0 16px;
  margin: 16px 0;
  transition: width 0.6s;
  width: 100%;

  ${(props) =>
    !props.opened &&
    css`
      transition: width 0.35s;
      height: ${props.widgetBaseHeight
        ? `${props.widgetBaseHeight}px`
        : '436px'};
      overflow: hidden;
      width: 0;

      > * {
        width: 624px;
      }
    `}
  > * {
    animation: ${(props) => props.opened && 'content-width 0.6s'};
  }
`;

const _Page: React.FC<PageProps> = ({
  children,
  width,
  maxWidth,
  title,
  transparent,
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
  widgetBaseHeight,
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
            style={{
              width: maxWidth ? '100%' : width ?? 0,
              maxWidth,
            }}
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
                          history.state?.idx
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
          {!(s || m) && (
            <Widget
              opened={widgetOpened}
              widgetBaseHeight={widgetBaseHeight}
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
                glass
                className={className}
                padding={
                  padding !== undefined && padding !== null
                    ? padding
                    : valBySize([4, 4])
                }
                borderRadius="xl"
                width="100%"
                transparent={transparent}
                bordered={!transparent}
                style={{
                  boxShadow: 'none',
                  background: 'var(--spectrum-secondary-color)',
                  border: 'none',
                }}
              >
                {children}
              </Box>
            </Flex.Item>
            {footer && (
              <Flex.Item marginTop={4} style={{ zIndex: 0 }}>
                {footer}
              </Flex.Item>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Page = styled(_Page)`
  box-shadow: var(--spectrum-box-box-shadow-form-wrapper);
`;
