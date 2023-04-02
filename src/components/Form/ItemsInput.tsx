import { ErrorMessage, FieldArray, useField } from "formik";
import React from "react";
import CustomInput from "./CustomInput";

type InputProps = {
  label: string;
  name: string;
  validate?: (value: any) => undefined | string | Promise<any>;
  value?: string;
  id: string;
  styles?: string;
};

type items = Array<{
  name: string;
  quantity: number;
  price: number;
  total: number;
}>;

export default function ItemsInput(props: InputProps) {
  const [field, meta] = useField(props);
  const values = field.value as items;
  return (
    <div>
      <label className="block text-lg font-bold text-neutral-900">
        {props.label}
      </label>
      <FieldArray
        name={props.name}
        render={(arrayHelpers) => (
          <div>
            {values.map((item, index) => (
              <div className={`${index !== 0 ? "mt-12" : "mt-6"}`} key={index}>
                <div className="mt-6 grid  grid-cols-[2fr_3fr_3fr_1fr] items-center gap-x-3 gap-y-6 lg:grid-cols-[6fr_2fr_3fr_3fr_1fr] lg:gap-x-4">
                  <CustomInput
                    type="text"
                    label="Item Name"
                    styles="col-span-full lg:col-span-1"
                    name={`items[${index}].name`}
                    id={`items[${index}].name`}
                    errorBottom={true}
                  />
                  <CustomInput
                    type="number"
                    label="Qty."
                    name={`items.${index}.quantity`}
                    id={`items.${index}.quantity`}
                    errorBottom={true}
                  />
                  <CustomInput
                    type="number"
                    label="Price"
                    name={`items.${index}.price`}
                    id={`items.${index}.price`}
                    errorBottom={true}
                  />
                  <CustomInput
                    type="number"
                    stylemode="disabled"
                    label="Total"
                    name={`items.${index}.total`}
                    id={`items.${index}.total`}
                    value={
                      isNaN(item.quantity * item.price)
                        ? "0"
                        : String((item.quantity * item.price).toFixed(2))
                    }
                  />

                  <button
                    className="translate-y-3"
                    type="button"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    <svg
                      width="13"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                        className="fill-[#888EB0] hover:fill-primary-200 dark:fill-neutral-800 dark:hover:fill-primary-200"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              className="mt-12 w-full rounded-3xl bg-neutral-600 py-3 text-center font-bold text-neutral-900 dark:bg-neutral-200 dark:text-neutral-600"
              type="button"
              onClick={() =>
                arrayHelpers.push({
                  name: "",
                  quantity: 0,
                  price: 0,
                  total: 0,
                })
              }
            >
              + Add New Item
            </button>
          </div>
        )}
      />
    </div>
  );
}
