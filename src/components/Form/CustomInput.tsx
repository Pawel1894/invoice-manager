import { useField } from "formik";

type InputProps = {
  label?: string;
  name: string;
  validate?: (value: any) => undefined | string | Promise<any>;
  type?: string;
  multiple?: boolean;
  value?: string;
  placeholder?: string;
  id: string;
  styles?: string;
  styleMode?: "disabled";
};
export default function CustomInput(props: InputProps) {
  const [field, meta] = useField(props);
  return (
    <div className={props.styles}>
      <label
        className="mb-2 block text-sm text-neutral-900"
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>
      <input
        disabled={props.styleMode === "disabled"}
        className={`w-full py-[0.625rem]  font-bold ${
          props.styleMode === "disabled"
            ? " text-neutral-400"
            : "rounded border border-neutral-900 px-5 text-neutral-500 hover:border-primary-200 focus:border-primary-200 active:border-primary-200"
        }  `}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}
