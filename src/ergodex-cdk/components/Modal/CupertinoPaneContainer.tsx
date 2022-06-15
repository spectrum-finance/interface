import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import React, { PropsWithChildren, useRef } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const PaneContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

// Cupertino Props https://github.com/roman-rr/cupertino-pane#Settings
const defaultPaneSettings: CupertinoSettings = {
  fitHeight: true,
  initialBreak: 'middle',
  breaks: {
    middle: { enabled: true, height: 300, bounce: true },
    bottom: { enabled: true, height: 80 },
  },
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

export const CupertinoPaneContainer: React.FC<
  PropsWithChildren<CupertinoPaneContainerProps>
> = ({ visible, children, className, ...paneSettings }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState<CupertinoPane>();

  const settings: CupertinoSettings = {
    ...defaultPaneSettings,
    ...paneSettings,
    cssClass: className,
  };

  useEffect(() => {
    if (!drawer && rootRef.current) {
      const pane = new CupertinoPane(rootRef.current, settings);
      setDrawer(pane);
    }
    return () => {
      drawer?.destroyResets();
    };
  }, [rootRef.current]);

  useEffect(() => {
    if (!drawer) return;
    if (visible) {
      drawer.present({ animate: true });
    }
    if (drawer.isPanePresented()) {
      drawer.destroy({ animate: true });
    }
  }, [visible, drawer]);

  return <PaneContainer ref={rootRef}>{children}</PaneContainer>;
};
