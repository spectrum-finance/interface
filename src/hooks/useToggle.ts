import { useCallback, useState } from 'react';

type ToggleReturnValue = [
  state: boolean,
  setOn: () => void,
  setOff: () => void,
];

export const useToggle = (defaultState: boolean): ToggleReturnValue => {
  const [state, setState] = useState(defaultState);

  const setOn = useCallback(() => setState(true), []);
  const setOff = useCallback(() => setState(false), []);

  return [state, setOn, setOff];
};
