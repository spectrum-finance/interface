import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

const calculateHeight = (elt: HTMLDivElement) =>
  parseFloat(window.getComputedStyle(elt).height);

export interface ExpandProps {
  children?: ReactNode | ReactNode[] | string;
  duration?: number;
  expanded?: boolean;
}

export const Expand: FC<ExpandProps> = ({ duration, children, expanded }) => {
  const containerRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(calculateHeight(containerRef.current));
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div
      style={{
        height,
        opacity: expanded ? '1' : '0',
        transition: `height ${duration || 300}ms, opacity ${duration || 300}ms`,
        overflow: expanded ? 'initial' : 'hidden',
      }}
    >
      {expanded && <div ref={containerRef as any}>{children}</div>}
    </div>
  );
};
