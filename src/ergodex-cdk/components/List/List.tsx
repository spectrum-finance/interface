import './List.less';

import { List as BaseList, ListProps as BaseListProps } from 'antd';
import cn from 'classnames';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { getGutter, Gutter } from '../../utils/gutter';

export interface ListProps<T> {
  readonly dataSource?: BaseListProps<T>['dataSource'];
  readonly gap?: number;
  readonly value?: T;
  readonly onChange?: (item: T) => void;
  readonly id?: BaseListProps<T>['id'];
  readonly rowKey?: BaseListProps<T>['rowKey'];
  readonly padding?: Gutter;
  readonly children?: (
    item: T,
    selectedItem?: T,
  ) => ReactNode | ReactNode[] | string;
  readonly className?: string;
  readonly transparent?: boolean;
  readonly height?: number;
}

export const List: FC<ListProps<any>> = ({
  dataSource,
  gap,
  children,
  transparent,
  height,
  id,
  rowKey,
  className,
  padding,
  onChange,
  value,
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

  const renderItem = (item: any): ReactNode | ReactNode[] => {
    if (!children) {
      return undefined;
    }

    return (
      <div
        onClick={() => {
          onChange && onChange(item);
        }}
      >
        {children(item, value)}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: getGutter(padding || 0),
      }}
      ref={ref as any}
    >
      {transparent && height && (
        <div
          className={cn('ant-list-overlay', {
            'ant-list-overlay--top': overlay === 'top',
            'ant-list-overlay--bottom': overlay === 'bottom',
          })}
        />
      )}
      <BaseList
        renderItem={renderItem}
        dataSource={dataSource}
        className={className}
        id={id}
        rowKey={rowKey}
        style={
          {
            height,
            overflow: !!height ? 'auto' : 'initial',
            '--item-gap': `calc(var(--ergo-base-gutter) * ${gap})`,
          } as any
        }
      />
    </div>
  );
};
