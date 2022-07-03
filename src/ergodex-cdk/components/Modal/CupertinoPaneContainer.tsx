import type { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
// @ts-expect-error
import { CupertinoPane as CupertinoPaneClass } from 'cupertino-pane/dist/core';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { CupertinoBackdropModule } from './CupertinoBackdropModule';
import { CupertinoFitHeightModule } from './CupertinoFitHeightModule';

const PaneContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

// Cupertino Props https://github.com/roman-rr/cupertino-pane#Settings
const defaultPaneSettings: CupertinoSettings = {
  modules: [CupertinoFitHeightModule, CupertinoBackdropModule],
  fitHeight: true,
  // parentElement: 'body',
  // initialBreak: 'top',
  // breaks: {
  //   middle: { enabled: true, height: 300 },
  //   bottom: { enabled: true, height: 80 },
  // },
  backdropOpacity: 0.5,
  backdrop: true,
  dragBy: ['.draggable'],
  buttonDestroy: true,
};

interface CupertinoPaneContainerProps
  extends Omit<CupertinoSettings, 'cssClass'> {
  className?: string;
  visible?: boolean;
}

export class CupertinoPaneContainer extends React.Component<CupertinoPaneContainerProps> {
  rootRef = React.createRef<HTMLDivElement>();
  contentRef = React.createRef<HTMLDivElement>();
  drawer?: CupertinoPane;
  settings?: CupertinoSettings;
  observer?: ResizeObserver;

  componentDidMount(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { visible, children, className, ...paneSettings } = this.props;
    this.settings = {
      ...defaultPaneSettings,
      ...paneSettings,
      cssClass: className,
    };

    this.drawer = new CupertinoPaneClass(this.rootRef.current!, this.settings);
    if (this.settings.fitHeight) {
      this.observer = new ResizeObserver((entries) => {
        const entry = entries.find((e) => e.target === this.contentRef.current);
        if (entry && this.props.visible && this.drawer?.isPanePresented()) {
          // @ts-expect-error method added by CupertinoFitHeightModule
          this.drawer.calcFitHeight();
        }
      });
      this.observer.observe(this.contentRef.current!);
    }
  }
  componentDidUpdate(): void {
    if (!this.drawer) return;
    const isPresented = this.drawer.isPanePresented();
    if (this.props.visible && !isPresented) {
      this.drawer.present({ animate: true });
    }
    if (!this.props.visible && isPresented) {
      this.drawer.destroy({ animate: true });
    }
  }

  componentWillUnmount(): void {
    if (this.drawer?.isPanePresented()) {
      this.drawer?.destroy();
    }
    this.observer?.disconnect();
  }

  render(): ReactNode {
    return (
      <PaneContainer ref={this.rootRef}>
        <div ref={this.contentRef}>{this.props.children}</div>
      </PaneContainer>
    );
  }
}
