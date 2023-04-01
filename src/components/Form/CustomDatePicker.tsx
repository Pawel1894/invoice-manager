import { useField, useFormikContext } from "formik";
import ReactDatePicker from "react-datepicker";

type InputProps = {
  label: string;
  name: string;
  validate?: (value: any) => undefined | string | Promise<any>;
  multiple?: boolean;
  value?: string;
  placeholder?: string;
  id: string;
  styles?: string;
};
export default function CustomDatePicker(props: InputProps) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const value = field.value as string;
  return (
    <div className={props.styles}>
      <label
        className="mb-2 block text-sm text-neutral-900"
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>
      <ReactDatePicker
        {...field}
        {...props}
        selected={(value && new Date(value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
        dateFormat={"dd MMM yyyy"}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}
