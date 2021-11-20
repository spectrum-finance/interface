import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Typography } from '../Typography/Typography';

interface ModalTitleContextType {
  readonly title: ReactNode;
  readonly setTitle: (title: ReactNode) => void;
}

export const ModalTitleContext = createContext<ModalTitleContextType>({
  title: '',
  setTitle: () => {},
});

export const ModalTitleContextProvider: FC<{ children: any }> = ({
  children,
}) => {
  const [title, setTitle] = useState<ReactNode>('');

  return (
    <ModalTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </ModalTitleContext.Provider>
  );
};

export const ModalInnerTitle: FC = () => {
  const { title } = useContext(ModalTitleContext);

  return <Typography.Title level={4}>{title}</Typography.Title>;
};

export const ModalTitle: FC = ({ children }: any) => {
  const { setTitle } = useContext(ModalTitleContext);

  useEffect(() => {
    setTitle(children);
  }, [children, setTitle]);

  return <></>;
};
