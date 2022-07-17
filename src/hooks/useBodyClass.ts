import { useEffect } from 'react';

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

export const useBodyClass = (className: string | Array<string>): void => {
  useEffect(() => {
    className instanceof Array
      ? className.map(addBodyClass)
      : addBodyClass(className);

    return () => {
      className instanceof Array
        ? className.map(removeBodyClass)
        : removeBodyClass(className);
    };
  }, [className]);
};
