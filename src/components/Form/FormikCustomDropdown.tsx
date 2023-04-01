// components/FormikCustomDropdown.tsx
import { useField, useFormikContext } from "formik";
import React from "react";
import CustomDropdown, { type CustomDropdownOption } from "./CustomDropdown";
type Props<T> = {
  name: string;
  options: CustomDropdownOption<T>[];
  label: string;
  id: string;
};
const FormikCustomDropdown = <T,>(props: Props<T>) => {
  const name = props.name;
  const [field] = useField<T>(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (val: T) => {
    setFieldValue(name, val);
  };
  return (
    <div>
      <label
        className="mb-2 block text-sm text-neutral-900"
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>
      <CustomDropdown
        options={props.options}
        onChange={handleChange}
        value={field.value}
      />
    </div>
  );
};
export default FormikCustomDropdown;
