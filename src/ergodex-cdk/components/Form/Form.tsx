import { Form, FormInstance, FormItemProps, FormProps } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';

const oldUseForm = Form.useForm;

// TODO: WRITE_OWN_FORMS
Form.useForm = (form?: FormInstance<any>) => {
  const [newForm] = oldUseForm(form);

  const oldSetFieldsValue = newForm.setFieldsValue;
  const oldSetFields = newForm.setFields;

  newForm.setFieldsValue = function (value: any) {
    oldSetFieldsValue.call(this, value);
    Promise.resolve().then(() => {
      if ((this as any)?.onFieldManuallyChange) {
        (this as any)?.onFieldManuallyChange(newForm.getFieldsValue());
      }
    });
  };

  newForm.setFields = function (fields: FieldData[]) {
    oldSetFields.call(this, fields);
    Promise.resolve().then(() => {
      if ((this as any)?.onFieldManuallyChange) {
        (this as any)?.onFieldManuallyChange(newForm.getFieldsValue());
      }
    });
  };

  return [newForm];
};

export { Form };
export type { FormInstance, FormItemProps, FormProps };
