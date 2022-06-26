import { getGutter, Gutter } from '@ergolabs/ui-kit';
import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AutoSizer, ScrollParams } from 'react-virtualized';
import {
  List as VirtualizedList,
  ListRowRenderer,
} from 'react-virtualized/dist/es/List';
import styled from 'styled-components';

import { uint } from '../../common/types';
import { Dictionary } from '../../common/utils/Dictionary';
import { Expand } from './common/Expand';
import { ListItem, ListItemFn } from './common/ListItem';
import { ListState } from './common/ListState';
import { ListContext } from './ListContext/ListContext';
import { Overlay, OverlayPosition } from './Overlay/Overlay';
import { getHeight } from './utils/getHeight';
import { getRowHeight } from './utils/getRowHeight';

const ItemContainer = styled.div`
  transition: all 0.3s;
`;

export interface ListProps<T> {
  readonly height?: CSSProperties['height'];
  readonly maxHeight?: CSSProperties['height'];
  readonly gap?: uint;
  readonly padding?: Gutter;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly overlay?: boolean;
  readonly items: T[];
  readonly itemHeight: number;
  readonly itemKey: keyof T;
  readonly expand?: Expand;
  readonly children:
    | ((childProps: ListItem<T>) => ReactNode | ReactNode[] | string)
    | (
        | ((childProps: ListItem<T>) => ReactNode | ReactNode[] | string)
        | ReactNode
      )[];
}

export const List = <T extends unknown>({
  maxHeight,
  height,
  style,
  className,
  gap,
  padding,
  overlay,
  itemHeight,
  items,
  children,
  itemKey,
  expand,
}: ListProps<T>): ReactElement => {
  const ref = useRef<VirtualizedList>();

  const [overlayPosition, setOverlayPosition] =
    useState<OverlayPosition>('bottom');
  const [selectedItems, setSelectedItems] = useState<uint[]>([]);

  const [states, setStates] = useState<Dictionary<ListState>>({});

  const itemRenderer: (props: ListItem<T>) => ReactNode | ReactNode[] | string =
    children instanceof Array
      ? (children.find((c) => c instanceof Function) as ListItemFn<T>)
      : children;

  const statesRenderer =
    children instanceof Array
      ? children.filter((c) => !(c instanceof Function))
      : [];

  const currentState = Object.values(states).find((sr) => sr.condition);

  useEffect(() => {
    setSelectedItems([]);
  }, [items]);

  useEffect(() => {
    ref.current?.recomputeRowHeights();
  }, [selectedItems]);

  const handleExpand = (currentIndex: uint) => {
    if (!expand) {
      return;
    }
    if (expand.accordion) {
      setSelectedItems([currentIndex]);
    } else {
      setSelectedItems(selectedItems.concat(currentIndex));
    }
  };

  const handleCollapse = (currentIndex: uint) => {
    if (!expand) {
      return;
    }
    setSelectedItems(selectedItems.filter((index) => index !== currentIndex));
  };

  const addListState = (s: ListState): void => {
    setStates((prev) => ({ ...prev, [s.name]: s }));
  };

  const listItemRenderer: ListRowRenderer = ({ index, key, style }) => {
    const item = items[index];
    const isItemSelected = selectedItems.includes(index);

    return (
      <ItemContainer style={style} key={(item[itemKey] as any) || key}>
        {itemRenderer &&
          itemRenderer({
            item,
            index,
            height: isItemSelected
              ? itemHeight + (expand?.height || 0)
              : itemHeight,
            itemHeight: itemHeight,
            expandHeight: expand?.height || 0,
            expanded: selectedItems.includes(index),
            expand: handleExpand.bind(null, index),
            collapse: handleCollapse.bind(null, index),
          })}
      </ItemContainer>
    );
  };

  const handleScroll = (params: ScrollParams) => {
    if (!overlay || !params.clientHeight) {
      return;
    }
    if (params.scrollHeight - params.scrollTop === params.clientHeight) {
      setOverlayPosition('top');
    } else {
      setOverlayPosition('bottom');
    }
  };

  return (
    <ListContext.Provider value={{ states: states, addState: addListState }}>
      {currentState ? (
        currentState.children
      ) : (
        <div
          className={className}
          style={{
            ...style,
            padding: getGutter(padding || 0),
            position: 'relative',
          }}
        >
          {/*{(!!height || !!maxHeight) && overlay && (*/}
          {/*  <Overlay position={overlayPosition} />*/}
          {/*)}*/}
          <div
            style={{
              height: getHeight(
                height,
                maxHeight,
                expand?.height || 0,
                items.length,
                selectedItems.length,
                itemHeight,
                gap,
              ),
            }}
          >
            <AutoSizer>
              {({ width, height }) => (
                <VirtualizedList
                  ref={ref as any}
                  height={height}
                  width={width}
                  onScroll={handleScroll}
                  rowHeight={({ index }) =>
                    getRowHeight(
                      index,
                      items.length,
                      selectedItems,
                      itemHeight,
                      expand?.height || 0,
                      gap,
                    )
                  }
                  rowRenderer={listItemRenderer}
                  rowCount={items.length}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      )}
      {statesRenderer}
    </ListContext.Provider>
  );
};
