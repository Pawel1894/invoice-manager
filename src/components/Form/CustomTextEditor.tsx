import { useField, useFormikContext } from "formik";
import { useState } from "react";
import { Editor, EditorProvider } from "react-simple-wysiwyg";
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
  stylemode?: "disabled";
  errorBottom?: boolean;
};
export default function CustomTextArea({ errorBottom, ...props }: InputProps) {
  const [field, meta] = useField(props);
  const [focusIn, setFocusIn] = useState(false);
  const { handleBlur, handleChange } = useFormikContext();

  return (
    <div className={`${props.styles ? props.styles : ""} relative`}>
      <label
        className={`mb-2 block text-sm  ${
          meta.touched && meta.error
            ? "text-accent-100"
            : "text-neutral-900 dark:text-neutral-600"
        }`}
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>
      <div
        className={`rounded-md border  hover:border-primary-100 ${
          focusIn
            ? "focusIndicator border-primary-100"
            : "border-neutral-900 dark:border-neutral-100"
        }`}
      >
        <EditorProvider>
          <Editor
            onFocus={() => setFocusIn(true)}
            onBlur={(e) => {
              handleBlur(e);
              setFocusIn(false);
            }}
            id={props.id}
            name={props.name}
            value={field.value as string}
            onChange={handleChange}
          ></Editor>
        </EditorProvider>
      </div>
      {meta.touched && meta.error ? (
        <div
          className={`absolute ${
            errorBottom ? "top-full" : "top-0"
          }  right-0 text-xs leading-5 text-accent-100`}
        >
          {meta.error}
        </div>
      ) : null}
    </div>
  );
}
