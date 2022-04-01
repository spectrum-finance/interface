import { createContext, useContext } from 'react';

import { Messages } from './core';
import { FormGroup } from './FormGroup';

export const FormContext = createContext<{
  form: FormGroup<any>;
  errorMessages?: Messages<any>;
  warningMessages?: Messages<any>;
}>({} as any);

export const useFormContext = (): {
  form: FormGroup<any>;
  errorMessages?: Messages<any>;
  warningMessages?: Messages<any>;
} => useContext(FormContext);
