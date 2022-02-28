import './List.less';

import { List as BaseList, ListProps as BaseListProps } from 'antd';
import cn from 'classnames';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { getGutter, Gutter } from '../../utils/gutter';

export interface ListProps<T> {
  readonly dataSource?: BaseListProps<T>['dataSource'];
  readonly gap?: number;
  readonly id?: BaseListProps<T>['id'];
  readonly rowKey?: BaseListProps<T>['rowKey'];
  readonly padding?: Gutter;
  readonly children?: (item: T) => ReactNode | ReactNode[] | string;
  readonly className?: string;
  readonly transparent?: boolean;
  readonly height?: number;
  readonly maxHeight?: number;
}

export const List: FC<ListProps<any>> = ({
  dataSource,
  gap,
  children,
  transparent,
  height,
  maxHeight,
  id,
  rowKey,
  className,
  padding,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [overlay, setOverlay] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    const container = ref.current?.querySelector('.ant-list');
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;

      if (target.scrollHeight - target.scrollTop === target.offsetHeight) {
        setOverlay('top');
      } else {
        setOverlay('bottom');
      }
    };

    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        padding: getGutter(padding || 0),
      }}
      ref={ref as any}
    >
      {transparent && (height || maxHeight) && (
        <div
          className={cn('ant-list-overlay', {
            'ant-list-overlay--top': overlay === 'top',
            'ant-list-overlay--bottom': overlay === 'bottom',
          })}
        />
      )}
      <BaseList
        renderItem={children}
        dataSource={dataSource}
        className={className}
        id={id}
        rowKey={rowKey}
        style={
          {
            height,
            maxHeight,
            overflow: !!height || !!maxHeight ? 'auto' : 'initial',
            '--item-gap': `calc(var(--ergo-base-gutter) * ${gap})`,
          } as any
        }
      />
    </div>
  );
};
